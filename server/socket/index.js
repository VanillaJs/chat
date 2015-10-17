var cookieParser = require('cookie-parser');
var config = require('../config');
var sessionStore = require('../lib/database/sessionStore');
var User = require('../models/user').User;
var Channel = require('../models/channel').Channel;
var Users;

var cookieMiddleware = cookieParser(config.get('session:secret'));

module.exports.Users = Users = {};

function loadSession(sid) {
	return new Promise(function(resolve, reject) {
		sessionStore.load(sid, function(err, session) {
			if (err) {
				// no arguments => no session
				reject('Can\'t load session');
			}
			resolve(session);
		});
	});
}

function loadUser(session) {
	if (!session.passport.user.user_id) {
		return Promise.reject();
	}

	return User.findById(session.passport.user.user_id);
}

module.exports.socket = function(server) {
	var io = require('socket.io').listen(server);

	io.set('origins', config.get('app:socketOrigin'));

	io.use((socket, next) => cookieMiddleware(socket.request, null, next));

	io.use(function(socket, next) {
		var sid = socket.request.signedCookies[config.get('session:key')];

		loadSession(sid)
			.then(function(session) {
				socket.handshake.session = session;
				return session;
			})
			.then(loadUser)
			.then(function(user) {
				var channel;
				var defaultChannel;
				channel = socket.handshake.session.passport.user.channel;
				defaultChannel = config.get('defaultChannel');
				socket.handshake.user = user;
				// Если пользователь уже присутствует
				if (Users.hasOwnProperty(user._id) && Users[user._id].soketData.length) {
					// проверяем какие сокеты уже отвалились
					// удаляем их
					Users[user._id].soketData = Users[user._id].soketData.filter(function(item) {
						return !item.disconnected;
					});
					// добавляем текущее соединение
					Users[user._id].soketData.push(socket);
				} else {
					// Если пользователя нет, то добавляем его
					const putData = {userData: user, soketData: [socket], channel: channel || defaultChannel};
					Users[user._id] = putData;
				}

				Channel
					.getContactsByUserID(user._id, Users)
					.then(function(contacts) {
						Users[user._id].contacts = contacts;
						// если мы удалили канал и он каким-то образом остался в нем
						if (!Users[user._id].contacts.hasOwnProperty(channel)) {
							Users[user._id].channel = defaultChannel;
						}
						next();
					});
			})
			.catch(err => {
				console.log(err.stack || err);
				next();
			});
	});

	io.on('connection', function socketConnectionHandler(socket) {
		require('./types/user')(socket);
		require('./types/channel')(socket);
	});

	return io;
};
