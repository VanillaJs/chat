module.exports = function (socket) {
	socket.on('disconnect', function() {
		socket.broadcast.to(socket.handshake.user.room).emit('s.user.send_messsage', {
			status:true,
			room_id:socket.handshake.user.room,
			text: socket.handshake.user.username + ' has left ' + socket.handshake.user.room + '.'
		});
	});
};
