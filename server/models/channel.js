var User = require('./user').User;
var Message = require('./message').Message;
var mongoose = require('./../lib/database/mongoose');
var Schema = mongoose.Schema;

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
	users: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]
});

schema.statics.findOrCreate = function(type, userCreateId, userAddId, callback) {
	var Channel = this;
	var newChannelObj;
	var newChannel;
	// если пользоваетель хочет добавить сама себя
	if (userCreateId === userAddId) {
		return callback('Alredy Exist!');
	}

	Channel.findOne( { $and: [ { users: { $in: [userCreateId] }  }, { users: { $in: [userAddId] } }, {type: type} ] }, function(err, channel) {
		if (!err) {
			if (channel) {
				callback('Alredy Exist!', null);
			} else {
				newChannelObj = {
					name: type + '_' + userCreateId + '_' + userAddId,
					type: type,
					users: [userCreateId, userAddId]
				};
				newChannel = new Channel(newChannelObj);
				newChannel.save(function(channelErr) {
					if (err) {
						return callback(channelErr);
					}
					callback(null, newChannel);
				});
			}
		} else {
			callback(err);
		}
	});
};

schema.statics.prepareChannel = function(id, channel, Users) {
	var customObject = {
		_id: channel._id,
		name: channel.name,
		is_online: false,
		type: channel.type,
		avatar: '',
		user: null,
		message_count: 0,
		color: '000'
	};
	var userID;
	if (channel.type === 'user') {
		channel.users.splice(channel.users.indexOf(id), 1);
		customObject.user = channel.users[0];
		if (channel.users.length > 0) {
			userID = channel.users[0];
			// Знаю , что плохо передавать глобальный объект , но ничего пока не поделаешь
			customObject.is_online = Users.hasOwnProperty(userID);
			// нужно будет очень сильно подумать ) асинхронно могут данные и не подтянуться =)
			User.getUserByID(userID, function(err, user) {
				customObject.name = user.username;
				customObject.avatar = user.avatar;
				customObject.color = user.color;
			});
			Message.getUnreadMessagesByChannel(channel._id, id, function messagesCallback(err, length) {
				if (!err) {
					customObject.message_count = length;
				}
			});
		}
		channel.users.push(id);
	} else {
		customObject.avatar = '';
	}

	return customObject;
};

schema.statics.getContactsByUserID = function(id, Users, callback) {
	var Channel = this;
	var channels;

	Channel.find({ users: { $in: [id] } }, function(err, channelsData) {
		if (!err) {
			channels = {};
			if (channelsData.length > 0) {
				// Говнокодик
				// проходим по всем каналам
				channelsData.forEach(function(channel) {
					channels[channel._id] = Channel.prepareChannel(id, channel, Users);
				});
			}
			callback(null, channels);
		} else {
			callback(err);
		}
	});
};

exports.Channel = mongoose.model('Channel', schema);
