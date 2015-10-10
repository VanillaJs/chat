function sendToAll(Users, event, data, id, channel) {
	Object.keys(Users).map(function(key) {
		Users[key].soketData.map(function(socket) {
			if (socket.handshake.user._id !== id && Users[key].channel === channel) {
				socket.emit(event, data);
			}
		});
	});
}

module.exports = sendToAll;
