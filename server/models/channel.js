var User = require('./user').User;
var Message = require('./message').Message;
var mongoose = require('./../lib/database/mongoose');
var Schema = mongoose.Schema;

// схема модели пользователя
var schema = new Schema({
	name: {
		type: String,
		required: true
	},
	type: {
		type: String,
		enum: ['room', 'user'],
		required: true
	},
	users: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]
});

schema.statics.findOrCreate = function(type, userCreateId, userAddId) {
	var Channel = this;
	var newChannelObj;
	var newChannel = {};
	// если пользоваетель хочет добавить сама себя
	if (userCreateId !== userAddId) {
		return Channel.findOne({$and: [{users: {$in: [userCreateId]}}, {users: {$in: [userAddId]}}, {type: type}]}).
			then(function(channel) {
				if (!channel) {
					newChannelObj = {
						name: type + '_' + userCreateId + '_' + userAddId,
						type: type,
						users: [userCreateId, userAddId]
					};
					newChannel = new Channel(newChannelObj);
					return newChannel.save();
				}
				return Promise.resolve({});
			});
	}

	return Promise.reslove(newChannel);
};

schema.statics.getChannelInitialData = function(channel) {
	return {
		_id: channel._id,
		user: null,
		type: channel.type,
		name: channel.name,
		is_online: false,
		message_count: 0,
		avatar: '',
		color: '000',
		lastMessage: '',
		total_messages: 0
	};
};

/**
 * prepareChannel
 * @param  {String} id      User id
 * @param  {Object} channel Channel data
 * @param  {Object} Users   Global users object, contain all active chat users
 * @return {Promise}
 */
schema.statics.prepareChannel = function(id, channel, Users) {
	var userID;
	var customObject = this.getChannelInitialData(channel);
	if (channel.type === 'user') {
		channel.users.splice(channel.users.indexOf(id), 1);
		userID = customObject.user = channel.users[0];
		channel.users.push(id);
		// Знаю , что плохо передавать глобальный объект , но ничего пока не поделаешь
		customObject.is_online = Users.hasOwnProperty(userID);

		return Promise.all(
			[
				User.getUserByID(userID),
				Message.getUnreadMessagesByChannel(channel._id, id),
				Message.getLastChannelMessage(channel._id),
				Message.getMessagesCountByChannel(channel._id)
			])
			.then(function(result) {
				var user = result[0];
				var unreadMessages = result[1];
				var lastMessage = result[2] ? result[2].message : '';
				var totalMessages = result[3] ? result[3] : customObject.total_messages;
				return Object.assign(customObject, {
					name: user.username,
					avatar: user.avatar,
					color: user.color,
					message_count: unreadMessages.length,
					lastMessage: lastMessage,
					total_messages: totalMessages
				});
			});
	}

	return Promise.reslove(customObject);
};

schema.statics.getContactsByUserID = function(id, Users) {
	var Channel = this;

	return Channel.find({ users: { $in: [id] } }).then(function(channelsData) {
		if (channelsData.length > 0) {
			return Promise
				.all(channelsData.map(function(channel) {
					return Channel.prepareChannel(id, channel, Users);
				}))
				.then(function(result) {
					var channels = {};
					result.forEach(function(channel) {
						channels[channel._id] = channel;
					});
					return channels;
				});
		}
		return Promise.resolve({});
	});
};

exports.Channel = mongoose.model('Channel', schema);
