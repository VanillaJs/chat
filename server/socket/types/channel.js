/* eslint id-length: 1*/
var sendStatus = require('../../lib/channelstatus');
var Handler = require('./handler/channel')
var sendToAll = require('../../lib/sendtoall');
var config = require('./../../config');
var getSystemMessage = require('../../lib/getsystemmessage');

module.exports = function(socket, Users) {
	// Вход пользователя в комнату чата
	var handlerChannel;
	var mess;
	var channel = Users[socket.handshake.user._id].channel;

	sendStatus(socket.handshake.user._id, Users, 's.channel.online');
	if (channel === config.get('defaultChannel')) {
		mess = getSystemMessage(socket.handshake.user.username + ' Join channel (STOP TROLLING)', config.get('defaultChannel'));
		sendToAll(Users, 's.user.send_message', mess, socket.handshake.user._id, config.get('defaultChannel'));
	}

	socket.join(channel);

	socket.emit('s.channel.join', {channel: channel});

	handlerChannel = new Handler(socket, Users);
	handlerChannel.bindSocketEvents();
};
