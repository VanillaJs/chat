var Channel = require('../../models/channel').Channel;
var Message = require('../../models/message').Message;

module.exports = function (socket) {

	var sendMessage = function(status, room_id, message) {
		socket.broadcast.to(room_id).emit('s.user.send_message', {
			status:true,
			room_id:room_id,
			userId:room_id,
			message: message
		});
	}
	//Добавление контактов логика еще не готова
	socket.on('c.user.get_data', function(obj) {
		Channel.getContactsByUserID(socket.handshake.user._id, function(err, contacts){
			socket.emit('s.user.set_data', {data:socket.handshake.user, contacts:contacts});
		});

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
				console.log(err);
				if(err)
				{
					status = false;
				}
				else
				{
					sendMessage(true, message.room_id, message_new)
				}

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
