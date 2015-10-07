/* eslint id-length: 1*/
var sendStatus = require('../../lib/channelstatus');
var Handler = require('./handler/channel');

module.exports = function(socket, Users) {
	// Вход пользователя в комнату чата
	var handlerChannel;
	var channel = Users[socket.handshake.user._id].channel;

	sendStatus(socket.handshake.user._id, Users, 's.channel.online');

	socket.join(channel);

	socket.emit('s.channel.join', {channel: channel});

	handlerChannel = new Handler(socket, Users);
	handlerChannel.bindSocketEvents();
};
