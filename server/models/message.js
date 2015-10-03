var async = require('async');
var MessageType = require('./messagetype').MessageType;
var mongoose = require('./../lib/database/mongoose');
var Schema = mongoose.Schema;

// схема модели Сообщений
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

schema.statics.getListByParams = function(channelId, pageNum, callback) {
	var Message = this;
	var limit = 10;
	var skip = limit * pageNum - limit;
	async.waterfall([
		function(callback) {
			if (skip > 0) {
				Message.find({channelId: channelId}, callback).sort({created: -1}).skip(skip).limit(limit);
			} else {
				Message.find({channelId: channelId}, callback).sort({created: -1}).limit(limit);
			}
		},
		function(messages, callback) {
			callback(null, messages);
		}
	], callback);
};

schema.statics.getUnreadMessagesByChannel = function(channelId, userId, callback) {
	// будет логика запросв
	var Message = this;
	async.waterfall([
		function(callback) {
			Message.find({$and: [ {read: { $nin: [userId] }}, {channelId: channelId} ]}, callback);
		},
		function(messages, callback) {
			callback(null, messages.length);
		}
	], callback);
};

schema.statics.setRead = function(data) {
	var Message = this;
	Message.update({_id: { $in: data.messages }}, { $push: { read: data.userId } }, {multi: true}, function (err) {
		console.log(err);
	});
}

schema.statics.addNew = function(message, callback) {
	var Message = this;
	async.waterfall([
		function(callback) {
			MessageType.findOne({name: message.message_type}, callback);
		},
		function(messageType, callback) {
			var newMessageType;
			if (!messageType) {
				newMessageType = new MessageType({name: message.message_type, type: message.message_type});
				newMessageType.save(function(err) {
					if (err) {
						return callback(err);
					}
					callback(null, newMessageType);
				});
			}

			callback(null, messageType);
		},
		function(messageType, callback) {
			var newMessageObj;
			var newMessage;

			if (messageType) {
				newMessageObj = {
					channelId: message.room_id,
					userId: message.userId,
					messageTypeId: messageType._id,
					message: message.text,
					read: [message.userId]
				};
				newMessage = new Message(newMessageObj);
				newMessage.save(function(err) {
					if (err) {
						return callback(err);
					}
					callback(null, newMessage);
				});
			} else {
				// set error
				callback(null, newMessage);
			}
		}

	], callback);
};

exports.Message = mongoose.model('Message', schema);
