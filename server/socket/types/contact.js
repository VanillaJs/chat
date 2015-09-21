var User = require('../../models/user').User;
var Channel = require('../../models/channel').Channel;

module.exports = function (socket) {
	//Добавление контактов логика еще не готова
	socket.on('c.contact.add', function(user) {
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

						socket.emit('s.contact.add', {data: send_data});
					});
				}
			} else {
				//пользователь не найден
				socket.emit('s.contact.add', {data: send_data});
			}

		});
	});
};
