var Handler = require('./handler/channel');
var manager = require('../manager');

module.exports = function(socket) {
	var channel = manager.users.getById(socket.handshake.user._id).channel;

	manager.sendStatus('s.channel.online', socket.handshake.user._id);
	socket.join(channel);
	socket.emit('s.channel.join', {channel});

	(new Handler(socket)).bindSocketEvents();
};
