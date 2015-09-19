module.exports = function (socket, room) {
	// Вход пользователя в комнату чата
	socket.join(room);
	// Обнаружение пользователя в данной комнате
	// Оповещение пользователя о том, что он находится в новой комнате
	socket.emit('joinResult', {room: room});
	socket.handshake.user.room = room;
	// Оповещение других пользователей о появлении нового
	// пользователя в комнате чата
	socket.broadcast.to(room).emit('message', {
		text: socket.handshake.user.username + ' has joined ' + room + '.'
	});
};
