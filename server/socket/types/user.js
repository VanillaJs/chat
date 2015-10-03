var Message = require('../../models/message').Message;
var sendStatus = require('../../lib/channelstatus');
var config = require('./../../config');

module.exports = function(socket, Users) {
	var data = Users[socket.handshake.user._id];
	var sendData;
	var sendMessage = function(status, channelId, message) {
		var toUser = data.contacts[channelId];
		// Проверяем пользователь онлайн или нет
		if (toUser !== undefined && Users.hasOwnProperty(toUser.user)) {
			// проверяем, что он не находится в этом канале
			if (Users[toUser.user].channel !== channelId) {
				// отправляем ему сообщение
				sendStatus(socket.handshake.user._id, Users, 's.user.send_private', toUser, {message_count: 1});
			}
		}

		sendData = {
			status: true,
			chnnelId: channelId,
			userId: message.userId,
			message: message
		};
        //

		socket.broadcast.to(channelId).emit('s.user.send_message', sendData);
	};

	// Добавление контактов логика еще не готова
	socket.on('c.user.get_data', function() {
		setTimeout(function() {
			socket.emit('s.user.set_data', {data: data.userData, contacts: data.contacts});
		}, 50);
	});

	socket.on('c.user.send_message', function(message) {
		// var status = false;
		// save to database
		message.userId = socket.handshake.user._id;
		if (data.channel === config.get('defaultChannel')) {
			message.message = message.text;
			message.userId = socket.handshake.user.username;
			sendMessage(true, message.room_id, message);
		} else {
			console.log(message);
			// пишем в базу
			Message.addNew(message, function(err, messageNew) {
				sendMessage(true, messageNew.channelId, messageNew);
			});
		}
	});

	socket.on('c.user.get_message_by_room', function(data) {
		// data.room_id
		// data.page
		Message.getListByParams(data.room_id, data.page, function(err, messages) {
			if (!err) {
				socket.emit('s.user.message_by_room', {data: messages.reverse()});
			}
		});
	});
};
