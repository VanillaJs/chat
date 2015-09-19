module.exports = function (socket) {
	socket.on('room.send_message', function (message) {
		console.log(message);
		socket.broadcast.to(message.room).emit('room.message', {
			userId:socket.handshake.user._id,
			message: socket.handshake.user.username + ': ' + message.message
		});
	});
};
