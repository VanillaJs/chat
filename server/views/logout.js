exports.get = function(req, res, next) {
	var io = req.app.get('io');
	var sid = req.session.id;
	var uid = req.user._id;
	var connectedSockets = io.Users[uid].soketData;

	req.session.destroy(function(err) {
		connectedSockets.forEach(function(socket, index) {
			if (socket.handshake.session.id === sid) {
				socket.emit('logout');
				socket.disconnect();
				connectedSockets.splice(index, 1);
			}
			// удаление пользователя из глобального скопа если нет сокетов с другими сессиями
			if (connectedSockets.length === 0) {
				delete io.Users[uid];
			}
		});

		if (err) {
			return next(err);
		}

		res.redirect('/login');
	});
};
