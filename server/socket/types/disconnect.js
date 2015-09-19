module.exports = function (socket) {
	socket.on('disconnect', function() {
		socket.broadcast.to(socket.handshake.user.room).emit('message', {
			text: socket.handshake.user.username + ' has left ' + socket.handshake.user.room + '.'
		});
	});
};
