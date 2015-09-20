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
	created: {
		type: Date,
		default: Date.now
	}
})

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
					if (err) return callback(err);
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
					message:message.text
				};
				var new_message = new Message(new_message_obj);
				new_message.save(function (err) {
					if (err) return callback(err);
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
