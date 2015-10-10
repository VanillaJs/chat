function sendToAll(Users, event, data, id) {
	Object.keys(Users).map(function(key) {
		Users[key].soketData.map(function(socket) {
			if (socket.handshake.user._id !== id) {
				socket.emit(event, data);
			}
		});
	});
}

module.exports = sendToAll;
