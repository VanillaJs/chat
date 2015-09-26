var sendStatus = require('../../lib/channelstatus');
module.exports = function (socket, Users) {
	socket.on('disconnect', function() {
		sendStatus(socket.handshake.user._id, Users, "s.channel.offline");
	});
};
