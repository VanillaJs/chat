var mongoose = require('../lib/database/mongoose');
var Schema = mongoose.Schema;
var MessageType = require('./Messagetype');

var schema = new Schema({
	channelId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Channel',
		index: true,
		required: true
	},
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	messageTypeId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'MessageType',
		required: true
	},
	message: {
		type: String,
		required: true
	},
	read: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
	created: {
		type: Date,
		default: Date.now
	}
});

schema.statics.getListByParams = function(channelId, pageNum) {
	var Message = this;
	var limit = 10;
	var skip = limit * pageNum - limit;
	var promise = Message.find({channelId: channelId}).sort({created: -1}).limit(limit);
	if (skip > 0) {
		promise.skip(skip);
	}
	return promise;
};

schema.statics.getMessagesCountByChannel = function(channelId) {
	var Message = this;
	return Message.find({channelId: channelId}).count();
};

schema.statics.getUnreadMessagesByChannel = function(channelId, userId) {
	return this.find({$and: [ {read: { $nin: [userId] }}, {channelId: channelId} ]});
};

schema.statics.getLastChannelMessage = function(channelId) {
	var _this = this;
	return MessageType
			.findByType('text')
			.then(function(textType) {
				if (!textType) {
					return {};
				}
				return _this.findOne({channelId: channelId, messageTypeId: textType._id}).sort({created: -1});
			});
};

schema.statics.setRead = function(data) {
	var Message = this;
	Message.update({_id: { $in: data.messages }}, { $push: { read: data.userId } }, {multi: true}, function(err) {
		console.log(err);
	});
};

schema.statics.addNew = function(message) {
	var Message = this;
	var newMessageType;
	var newMessageObj = {};
	var newMessage = {};
	return MessageType.findOne({name: message.message_type}).
		then(function(messageType) {
			if (!messageType) {
				newMessageType = new MessageType({name: message.message_type, type: message.message_type});
				return newMessageType.save();
			}
			return messageType;
		}).then(function(messageType) {
			if (messageType) {
				newMessageObj = {
					channelId: message.channelId,
					userId: message.userId,
					messageTypeId: messageType._id,
					message: message.text,
					read: [message.userId]
				};
				newMessage = new Message(newMessageObj);
				return newMessage.save();
			}

			Promise.reject('MessageType is not created!');
		});
};

module.exports = mongoose.model('Message', schema);
