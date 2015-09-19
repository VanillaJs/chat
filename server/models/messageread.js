var async = require('async');
var util = require('util');

var mongoose = require('./../lib/database/mongoose'),
	Schema = mongoose.Schema;

// схема модели Прочитаных сообщений
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
	messageId: {
		type:mongoose.Schema.Types.ObjectId,
		ref:'Message',
		required: true
	},
	isRead: {
		type: Integer,
		enum: [0, 1],
		required: true
	},
});

exports.Channel = mongoose.model('Message', schema);
