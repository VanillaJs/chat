var Handler = require('./handler/user');

module.exports = function(socket) {
	var handlerUser;
	socket.emit('s.user.set_user_id', socket.handshake.user._id);
	handlerUser = new Handler(socket);
	handlerUser.bindSocketEvents();
};
