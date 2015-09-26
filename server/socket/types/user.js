var Channel = require('../../models/channel').Channel;
var Message = require('../../models/message').Message;
var sendStatus = require('../../lib/channelstatus');
module.exports = function (socket, Users) {
	var data = Users[socket.handshake.user._id];

	var sendMessage = function(status, room_id, message) {
		var toUser = data.contacts[room_id];
		//Проверяем пользователь онлайн или нет
		if(Users.hasOwnProperty(toUser.user)) {
			//проверяем, что он не находится в этом канале
			if(Users[toUser].channel !== room_id) {
				//отправляем ему сообщение
				sendStatus(socket.handshake.user._id, Users, 's.user.send_private', toUser, {message_count: 1});
			}
		}

		socket.broadcast.to(room_id).emit('s.user.send_message', {
			status:true,
			room_id:room_id,
			userId:room_id,
			message: message
		});
	}
	//Добавление контактов логика еще не готова
	socket.on('c.user.get_data', function(obj) {
			socket.emit('s.user.set_data', {data:data.userData, contacts:data.contacts});

	});
	//отправление письма

	socket.on('c.user.send_message', function (message) {
		var status = false;
		//save to database
		if(socket.handshake.user.room === "Lobby")
		{
			sendMessage(true, message.room_id, message);
		}
		else
		{
			message.user_id = socket.handshake.user._id;
			//пишем в базу
			Message.addNew(message, function(err, message_new){
				if(!err)
				{
					status = true;
				}
				sendMessage(true, message.room_id, message_new);

			});
		}
	});

	socket.on('c.user.get_message_by_room', function(data) {
		//data.room_id
		//data.page
		Message.getListByParams(data.room_id, data.page, function(err, messages) {
			if(!err) {
				socket.emit('s.user.message_by_room', {data:messages});
			}
		});
	});
};
