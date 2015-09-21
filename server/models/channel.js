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

schema.statics.findOrCreate = function(type , user_create_id, user_add_id, callback) {
	var Channel = this;

	Channel.findOne( { $and: [ { users: { $in: [user_create_id] }  }, { users: { $in: [user_add_id] } }, {type:type} ] }, function(err, channel) {

		if (!err)
		{
			console.log(channel);
			if(channel) {
				callback("Alredy Exist!",null);
			} else {
				var new_channel_obj = {
					name:type + "_" + user_create_id + "_" + user_add_id,
					type:type,
					users:[user_create_id, user_add_id]
				};
				var new_channel = new Channel(new_channel_obj);
				new_channel.save(function (err) {
					if (err) { return callback(err) }
					callback(null, new_channel);
				});
			}

		}
		else
		{
			callback(err);
		}
	});
}

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
