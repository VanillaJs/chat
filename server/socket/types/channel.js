var User = require('../../models/user').User;
var Channel = require('../../models/channel').Channel;

module.exports = function (socket, Users) {
	// Вход пользователя в комнату чата
	var userData = Users[socket.handshake.user._id],
		room = userData.room;

	socket.join(room);
	// Обнаружение пользователя в данной комнате
	// Оповещение пользователя о том, что он находится в новой комнате

	socket.emit('s.channel.join', {room: room});

	socket.on('c.channel.join', function(room) {
		socket.leave(userData.room);
		Users[socket.handshake.user._id].room = room.id;
		socket.join(room.id);
		socket.emit('s.channel.join', {room: room.id});
	});

	//Добавление контактов логика еще не готова
	socket.on('c.channel.add', function(user) {
		var send_data = null;
		User.findByParams(user.username, user.email, function(err, user) {
			if(user)
			{
				if(!err)
				{
					//Если канал существует
					Channel.findOrCreate("user", socket.handshake.user._id, user._id, function(err , channel) {
						if(!err)
						{
							send_data = channel;
						}

						socket.emit('s.channel.add', {data: send_data});
					});
				}
			} else {
				//пользователь не найден
				socket.emit('s.channel.add', {data: send_data});
			}

		});
	});
};


