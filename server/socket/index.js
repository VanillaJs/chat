var config = require('../config');
var middleware = require('../middleware/socket');
var models = require('../models');
var manager = require('./manager');
var UserHandler = require('./handlers/user');
var ChannelHandler = require('./handlers/channel');
var DEFAULT_CHANNEL_ID = config.get('DEFAULT_CHANNEL_ID');

module.exports.socket = function(server) {
	var io = require('socket.io').listen(server);

	io.set('origins', config.get('app:socketOrigin'));
	io.use(middleware.cookie);
	io.use(middleware.loadSession);
	io.use(middleware.loadUser);

	io.use(function(socket, next) {
		var userId = socket.handshake.user._id;
		var user = manager.users.get(userId);
		var channel = socket.handshake.session.passport.user.channel;

		if (user) {
			user.updateSockets();
			user.sockets.push(socket);
		} else {
			user = manager.users.create(userId, {
				userData: user,
				socket: socket,
				channel: channel || DEFAULT_CHANNEL_ID
			});
		}

		models.Channel
			.getContactsByUserID(userId)
			.then(function(contacts) {
				user.contacts = contacts;
				if (!user.contacts.hasOwnProperty(channel)) {
					user.channel = DEFAULT_CHANNEL_ID;
				}
				next();
			})
			.catch(next);
	});

	io.on('connection', function socketConnectionHandler(socket) {
		manager.registerHandlers(socket.id, {
			user: new UserHandler(socket),
			channel: new ChannelHandler(socket)
		});
	});

	return io;
};
