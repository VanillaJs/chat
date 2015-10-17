var User = require('./../models/user').User;
var passport = require('./../lib/passport');

exports.post = function(req, res, next) {
	var colors = ['31b0c3', 'fdc689', 'f8a232', 'f8a232', 'f6a4c9', '8c6239', '39b54a'];
	var avatars = ['/static/images/avatar/1.png', '/static/images/avatar/2.png', '/static/images/avatar/3.png',
								 '/static/images/avatar/4.png', '/static/images/avatar/5.png', '/static/images/avatar/6.png', '/static/images/avatar/7.png'];
	var numC = Math.floor((Math.random() * colors.length) + 1) - 1;
	var numA = Math.floor((Math.random() * avatars.length) + 1) - 1;
	var color = colors[numC];
	var avatar = avatars[numA];
	var user = new User(
		{
			username: req.body.username,
			password: req.body.password,
			email: req.body.email,
			color: color,
			avatar: avatar
		}
	);
	user.save(function(err) {
		return err
			? next(err)
			: passport.authenticate('local')(req, res, function() {
				if (req.xhr) {
					res.json({error: null, created: true});
				} else {
					res.redirect('/');
				}
			});
	});
};

exports.get = function(req, res) {
	res.render('register');
};
