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

schema.statics.findOrCreate = function(type, userCreateId, userAddId, callback) {
	var Channel = this;
	var newChannelObj;
	var newChannel;
	// если пользоваетель хочет добавить сама себя
	if (userCreateId === userAddId) {
		return callback('Alredy Exist!');
	}

	Channel.findOne( { $and: [ { users: { $in: [userCreateId] } }, { users: { $in: [userAddId] } }, {type: type} ] }, function(err, channel) {
		if (!err) {
			if (channel) {
				callback('Alredy Exist!', null);
			} else {
				newChannelObj = {
					name: type + '_' + userCreateId + '_' + userAddId,
					type: type,
					users: [userCreateId, userAddId]
				};
				newChannel = new Channel(newChannelObj);
				newChannel.save(function(channelErr) {
					if (err) {
						return callback(channelErr);
					}
					callback(null, newChannel);
				});
			}
		} else {
			callback(err);
		}
	});
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
		color: '000'
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
				Message.getLastChannelMessage(channel._id)
			])
			.then(function(result) {
				var user = result[0];
				var unreadMessages = result[1];
				var lastMessage = result[2] ? result[2].message : '';
				return Object.assign(customObject, {
					name: user.username,
					avatar: user.avatar,
					color: user.color,
					message_count: unreadMessages.length,
					lastMessage: lastMessage
				});
			});
	}

	return Promise.reslove(customObject);
};

schema.statics.getContactsByUserID = function(id, Users) {
	var Channel = this;
	var channels = {};

	return Channel.find({ users: { $in: [id] } }).then(function(channelsData) {
		if (channelsData.length > 0) {
			return Promise
				.all(channelsData.map(function(channel) {
					return Channel.prepareChannel(id, channel, Users);
				}))
				.then(function(result) {
					return result;
				});
		}
		return Promise.resolve(channels);
	});
};

exports.Channel = mongoose.model('Channel', schema);
