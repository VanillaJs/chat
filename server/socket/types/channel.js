var User = require('../../models/user').User;
var Channel = require('../../models/channel').Channel;
var Message = require('../../models/message').Message;
var sendStatus = require('../../lib/channelstatus');

module.exports = function(socket, Users) {
	// Вход пользователя в комнату чата
	var userData = Users[socket.handshake.user._id];
	var channel = userData.channel;

	function ifUserOnline(id) {
		return Users.hasOwnProperty(id);
	}


	sendStatus(socket.handshake.user._id, Users, 's.channel.online');

	socket.join(channel);
	// Обнаружение пользователя в данной комнате
	// Оповещение пользователя о том, что он находится в новой комнате

	socket.emit('s.channel.join', {channel: channel});

	socket.on('c.channel.join', function(channel) {
		socket.leave(userData.room);
		Users[socket.handshake.user._id].channel = channel.id;
		socket.join(channel.id);
		socket.emit('s.channel.join', {channel: channel.id});
	});

	// Добавление контактов логика еще не готова
	socket.on('c.channel.add', function(user) {
		var sendData = null;
		User.findByParams(user.username, user.username, function(err, user) {
			var toUser;
			if (user) {
				if (!err) {
					// Если канал существует
					Channel.findOrCreate('user', socket.handshake.user._id, user._id, function(err, channel) {
						if (!err) {
							sendData = Channel.prepareChannel(socket.handshake.user._id, channel, Users);
							Users[socket.handshake.user._id].contacts[sendData._id] = sendData;
							if(ifUserOnline(user._id)) {
								Users[user._id].contacts[sendData._id] = Channel.prepareChannel(user._id, channel, Users);
							}

						}
						// Таймаут для того, что данные по пользователю приходят асинхронно
						setTimeout(function() {
							Users[socket.handshake.user._id].contacts[sendData._id] = sendData;
							toUser = sendData;
							if(ifUserOnline(user._id)) {
								sendStatus(socket.handshake.user._id, Users, 's.channel.add', toUser, Users[user._id].contacts[sendData._id]);
							}

							socket.emit('s.channel.add', {channel: sendData._id, custom: sendData});
						}, 50);
					});
				}
			} else {
				// пользователь не найден
				socket.emit('s.channel.add', sendData);
			}
		});
	});

	socket.on('c.channel.delete', function(channel) {
		Channel.findOne({_id: channel.id}).remove(function(err, mess) {
			var sendObject = {id: channel.id, is_delete: mess.result.n === 1};
			var toUser;
			// Удаление сообщений по каналу
			Message.find({ channelId: { $in: [channel.id] }  }).remove();
			if(ifUserOnline(userData.contacts[channel.id].user)) {
				toUser = userData.contacts[channel.id];
				sendStatus(socket.handshake.user._id, Users, 's.channel.delete', toUser);
			}

			// И удаляем из глобального объекта пользователя данный контакт
			delete Users[socket.handshake.user._id].contacts[channel.id];

			socket.emit('s.channel.delete', sendObject);
		});
	});

	socket.on('disconnect', function() {
		if (userData.soketData.length) {
			// проверяем какие сокеты уже отвалились
			for (index in userData.soketData) {
				if (userData.soketData[index].id === socket.id) {
					// удаляем их
					userData.soketData.splice(index, 1);
				}
			}
		}
		if(userData.soketData.length === 0) {

			sendStatus(socket.handshake.user._id, Users, 's.channel.offline');
			delete Users[socket.handshake.user._id];
		}

	});
};
