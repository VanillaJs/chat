module.exports = function (socket) {
	socket.on('message', function (message) {
		socket.broadcast.to(message.room).emit('message', {
			text: socket.handshake.user.username + ': ' + message.text
		});
	});
};
