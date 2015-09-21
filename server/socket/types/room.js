module.exports = function (socket, room) {
	// Вход пользователя в комнату чата
	socket.join(room);
	// Обнаружение пользователя в данной комнате
	// Оповещение пользователя о том, что он находится в новой комнате
	socket.emit('s.room.join', {room: room});
	socket.handshake.user.room = room;

	socket.on('c.room.join', function(room) {
		socket.leave(socket.handshake.user.room);
		socket.handshake.user.room = room.contact_id;
		socket.join(room.contact_id);
	});
};
