var async = require('async');
var cookieParser = require('cookie-parser');
var config = require('./../config');
var sessionStore = require('./../lib/database/sessionStore');
var HttpError = require('./../error').HttpError;
var User = require('./../models/user').User;
var Channel = require('./../models/channel').Channel;
var Users = {}; // Глобальный объект с пользователями и подключенными сокетами

function loadSession(sid, callback) {
	sessionStore.load(sid, function(err, session) {
		if (arguments.length === 0) {
			// no arguments => no session
			return callback(null, null);
		}

		return callback(null, session);
	});
}

function loadUser(session, callback) {
	if (!session.passport.user.user_id) {
		return callback(null, null);
	}

	User.findById(session.passport.user.user_id, function(err, user) {
		if (err) return callback(err);

		if (!user) {
			return callback(null, null);
		}
		callback(null, user);
	});
}

module.exports = function(server) {
	var secret = config.get('session:secret');
	var sessionKey = config.get('session:key');
	var io = require('socket.io').listen(server);

	io.set('origins', config.get('app:socketOrigin'));
	io.use(function(socket, next) {
		var handshakeData = socket.request;
		async.waterfall([
			function(callback) {
				// получить sid
				var parser = cookieParser(secret);
				parser(handshakeData, {}, function(err) {
					var sid = handshakeData.signedCookies[sessionKey];
					if (err) return callback(err);


					loadSession(sid, callback);
				});
			},
			function(session, callback) {
				if (!session) {
					return callback(new HttpError(401, 'No session'));
				}
				socket.handshake.session = session;
				loadUser(session, callback);
			},
			function(user, callback) {
				if (!user) {
					return callback(new HttpError(403, 'Anonymous session may not connect'));
				}
				callback(null, user);
			}
		], function(err, user) {
			var channel;
			var defaultChannel;
			if (err) {
				if (err instanceof HttpError) {
					return next(new Error('Not authorized'));
				}
				next(err);
			}
			channel = socket.handshake.session.passport.user.channel;
			defaultChannel = config.get('defaultChannel');
			socket.handshake.user = user;
			// Если пользователь уже присутствует
			if (Users.hasOwnProperty(user._id)) {
				if (Users[user._id].soketData.length) {
					// проверяем какие сокеты уже отвалились
					for (index in Users[user._id].soketData) {
						if (Users[user._id].soketData[index].disconnected) {
							// удаляем их
							Users[user._id].soketData.splice(index, 1);
						}
					}
				}
				// добавляем текущее соединение
				Users[user._id].soketData.push(socket);
			} else {
				// Если пользователя нет , то добавляем его
				const sockets = [];
				sockets.push(socket);
				const putData = {userData: user, soketData: sockets, channel: channel || defaultChannel};
				Users[user._id] = putData;
			}
			Channel.getContactsByUserID(user._id, Users, function getContactsByUserIDCallback(channelError, contacts) {
				Users[user._id].contacts = contacts;
				// если мы удалили канал и он каким-то образом остался в нем
				if (!Users[user._id].contacts.hasOwnProperty(channel)) {
					Users[user._id].channel = defaultChannel;
				}
				next(channelError);
			});
		});
	});


	io.on('connection', function socketConnectionHandler(socket) {
		require('./types/user')(socket, Users);
		require('./types/channel')(socket, Users);
		// генерирую событие списка комнат getContsctsList
		// Обработка пользовательских событий
	});

	io.Users = Users;

	return io;
};
