module.exports = function (socket) {
	socket.on('join', function(room) {
		socket.leave(currentRoom[socket.handshake.user.room]);
		joinRoom(socket, room.newRoom);
	});
};
