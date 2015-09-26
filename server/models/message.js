var async = require('async');
var util = require('util');
var MessageType = require('./messagetype').MessageType;

var mongoose = require('./../lib/database/mongoose'),
	Schema = mongoose.Schema;

// схема модели Сообщений
var schema = new Schema({
	channelId: {
		type:mongoose.Schema.Types.ObjectId,
		ref:'Channel',
		index: true,
		required: true
	},
	userId: {
		type:mongoose.Schema.Types.ObjectId,
		ref:'User',
		required: true
	},
	messageTypeId: {
		type:mongoose.Schema.Types.ObjectId,
		ref:'MessageType',
		required: true
	},
	message: {
		type: String,
		required: true
	},
	read:[{type:mongoose.Schema.Types.ObjectId, ref:'User'}],
	created: {
		type: Date,
		default: Date.now
	}
});

schema.statics.getListByParams = function (channel_id, page_num, callback) {
	var Message = this;
	var limit = 10;
	var skip = limit*page_num - limit;
	if(page_num > 1) {

	}
	async.waterfall([
		function (callback) {
			if(skip > 0) {
				Message.find({channelId:channel_id}, callback).sort({created: 1}).skip(skip);
			} else {
				Message.find({channelId:channel_id}, callback).sort({created: 1}).limit(limit);
			}
		},
		function (messages, callback) {
			callback(null, messages);
		}
	], callback);
};

schema.statics.getUnreadMessagesByChannel= function (channelId, userId, callback) {
//будет логика запросв
	var Message = this;
	async.waterfall([
		function (callback) {
			Message.find({$and:[ {read: { $nin: [userId] }}, {channelId : channelId} ]},callback);
		},
		function(messages, callback) {
			callback(null, messages.length);
		}
	], callback);
};

schema.statics.addNew = function(message, callback) {
	var Message = this;
	async.waterfall([
		function (callback) {
			MessageType.findOne({name:message.message_type}, callback);
		},
		function(message_type, callback)
		{
			if(!message_type) {
				var new_message_type = new MessageType({name:message.message_type, type:message.message_type});
				new_message_type.save(function (err) {
					if (err) { return callback(err) }
					callback(null, new_message_type);
				});
			}

			callback(null, message_type);
		},
		function (message_type, callback) {
			if(message_type)
			{
				var new_message_obj = {
					channelId:message.room_id,
					userId:message.user_id,
					messageTypeId:message_type.id,
					message:message.text,
					read:[message.user_id]
				};
				var new_message = new Message(new_message_obj);
				new_message.save(function (err) {
					if (err) { return callback(err) }
					callback(null, new_message);
				});
			}
			else
			{//set error
				callback(null, message_type);
			}

		}

	], callback);
}

exports.Message = mongoose.model('Message', schema);
