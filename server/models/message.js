var async = require('async');
var util = require('util');

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
	},
});

exports.Channel = mongoose.model('Message', schema);
