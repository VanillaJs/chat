var models = require('mongoose').models;

module.exports = function(req, res, next) {
	req.user = res.locals.user = null;

	if (req.session.passport === undefined || !req.session.passport.user.user_id) {
		return next();
	}

	models.User.findById(req.session.passport.user.user_id)
		.then(function(user) {
			req.user = res.locals.user = user;
			next();
		})
		.catch(next);
};
