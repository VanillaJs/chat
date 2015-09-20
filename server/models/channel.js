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

schema.statics.getContactsByUserID = function(id, callback) {
	var Channel = this;

	Channel.find({ users: { $in: [id] } },function (err, channelsData) {
		if (!err)
		{
			callback(null,channelsData);
		}
		else
		{
			callback(err);
		}

	});

}

exports.Channel = mongoose.model('Channel', schema);
