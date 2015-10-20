exports.get = function(req, res) {
	var user = req.session.passport.user.user_id;
	res.render('chat', {user: user});
};
