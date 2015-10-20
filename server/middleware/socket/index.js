var cookieParser = require('cookie-parser');
var models = require('../../models');
var config = require('../../config');
var expressCookieMiddleware = cookieParser(config.get('session:secret'));
var sessionStore = require('../../lib/database/sessionStore');

module.exports.cookie = function(socket, next) {
	expressCookieMiddleware(socket.request, null, next);
};

module.exports.loadSession = function loadSession(socket, next) {
	var sid = socket.request.signedCookies[config.get('session:key')];

	sessionStore.load(sid, function(err, session) {
		if (err) {
			next(err);
		}
		socket.handshake.session = session;
		next();
	});
};

module.exports.loadUser = function loadUser(socket, next) {
	var session = socket.handshake.session;
	if (!session.passport.user.user_id) {
		next();
	}

	models.User
		.findById(session.passport.user.user_id)
		.then(user => {
			socket.handshake.user = user.toObject();
			next();
		})
		.catch(next);
};
