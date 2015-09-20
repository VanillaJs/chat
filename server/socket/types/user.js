var Channel = require('../../models/channel').Channel;
var Message = require('../../models/message').Message;

module.exports = function (socket) {
	//Добавление контактов логика еще не готова
	socket.on('c.user.get_data', function(obj) {
		Channel.getContactsByUserID(socket.handshake.user._id, function(err, contacts){
			socket.emit('s.user.set_data', {data:socket.handshake.user, contacts:contacts});
		});

	});

	socket.on('c.user.send_message', function (message) {
		var status = false;
		//save to database
		message.user_id = socket.handshake.user._id;
		Message.addNew(message, function(err, message_new){
			console.log(err);
			if(err)
			{
				status = false;
			}
			socket.broadcast.to(message.room_id).emit('s.user.send_message', {
				status:true,
				room_id:message.room_id,
				message: message_new
			});
		});

	});
};
