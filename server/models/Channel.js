var mongoose = require('../lib/database/mongoose');
var models = mongoose.models;
var Schema = mongoose.Schema;

var schema = new Schema({
	name: {
		type: String,
		required: true
	},
	displayName: {
		type: String,
		required: true
	},
	ownerId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	type: {
		type: String,
		enum: ['room', 'user'],
		required: true
	},
	private: {
		type: Boolean,
		default: false,
		required: true
	},
	users: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]
});

schema.statics.findOrCreate = function(type, userCreateId, userAddId) {
	var Channel = this;
	var newChannelObj;
	var newChannel = {};

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
				return Promise.resolve(channel);
			});
	}

	return Promise.resolve(newChannel);
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
 * @return {Promise}
 */
schema.statics.prepareChannel = function(id, channel) {
	var userID;
	var customObject = this.getChannelInitialData(channel);
	if (channel.type === 'user') {
		channel.users.splice(channel.users.indexOf(id), 1);
		userID = customObject.user = channel.users[0];
		channel.users.push(id);

		return Promise.all(
			[
				models.User.getUserByID(userID),
				models.Message.getUnreadMessagesByChannel(channel._id, id),
				models.Message.getLastChannelMessage(channel._id),
				models.Message.getMessagesCountByChannel(channel._id)
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

	return Promise.resolve(customObject);
};

schema.statics.getContactsByUserID = function(id) {
	var Channel = this;

	return Channel.find({ users: { $in: [id] } }).then(function(channelsData) {
		if (channelsData.length > 0) {
			return Promise
				.all(channelsData.map(function(channel) {
					return Channel.prepareChannel(id, channel);
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

module.exports = mongoose.model('Channel', schema);
