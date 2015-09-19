var async = require('async');
var util = require('util');

var mongoose = require('./../lib/database/mongoose'),
	Schema = mongoose.Schema;

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
	users : [{type:mongoose.Schema.Types.ObjectId, ref:'User'}]
});

exports.Channel = mongoose.model('Channel', schema);
