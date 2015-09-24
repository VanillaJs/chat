var async = require('async');
var util = require('util');
var User = require('./user').User;
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
	//если пользоваетель хочет добавить сама себя
	if(user_create_id === user_add_id) {
		return callback("Alredy Exist!");
	}

	Channel.findOne( { $and: [ { users: { $in: [user_create_id] }  }, { users: { $in: [user_add_id] } }, {type:type} ] }, function(err, channel) {

		if (!err)
		{
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
			if(channelsData.length > 0) {
				//Говнокодик
				//проходим по всем каналам
				channelsData.forEach(function(channel, index) {
					if(channel.type === "user") {
						channel.users.splice(channel.users.indexOf(id), 1);
						channelsData[index].users = channel.users;
						if(channel.users.length > 0) {
							var channelID = channel.users[0];
							User.getUserByID(channelID, function(err, user) {
								channelsData[index].name = user.username;
								//channelsData[index].avatar = user.avatar;
							});
						}
					} else {
						//channelsData[index].avatar = "";
					}
				});
			}
			callback(null,channelsData);
		}
		else
		{
			callback(err);
		}

	});

}

exports.Channel = mongoose.model('Channel', schema);
