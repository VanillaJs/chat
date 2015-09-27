module.exports = function(req, res, next) {
	if (req.session.passport === undefined || !req.session.passport.user.user_id) {
		res.redirect('/login');
	}

	next();
};
