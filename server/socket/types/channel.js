var User = require('../../models/user').User;
var Channel = require('../../models/channel').Channel;
var sendStatus = require('../../lib/channelstatus');

module.exports = function (socket, Users) {

	// Вход пользователя в комнату чата
	var userData = Users[socket.handshake.user._id],
		channel = userData.channel;

	sendStatus(socket.handshake.user._id, Users, "online");

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

	//Добавление контактов логика еще не готова
	socket.on('c.channel.add', function(user) {
		var send_data = null;
		User.findByParams(user.username, user.username, function(err, user) {
			if(user)
			{
				if(!err)
				{
					//Если канал существует
					Channel.findOrCreate("user", socket.handshake.user._id, user._id, function(err , channel) {
						if(!err)
						{
							send_data = Channel.prepareChannel(socket.handshake.user._id, channel, Users);
						}
						//Таймаут для того, что данные по пользователю приходят асинхронно
						setTimeout(function () {
							socket.emit('s.channel.add', send_data);
						}, 50);
					});
				}
			} else {
				//пользователь не найден
				socket.emit('s.channel.add', send_data);
			}

		});
	});

	socket.on('c.channel.delete', function(channel) {
		Channel.findOne({_id:channel.id}).remove(function(err, mess) {
			var sendObject = {id:channel.id, is_delete :mess.result.n === 1};

			/*
			* Нужно добавить удалений сообщения по каналу
			* а также выод из канала 2-го пользователя из контакта
			* и отправить ему, что канал удален ну или как-то так
			 */
			socket.emit('s.channel.delete', sendObject);
		});
	});
};


