var models = require('mongoose').models;
var passport = require('../lib/passport');
var config = require('../config');
var AVATAR_COLORS = config.get('AVATAR_COLORS');
var AVATAR_IMAGES = config.get('AVATAR_IMAGES');

exports.post = function(req, res, next) {
	var numC = Math.floor((Math.random() * AVATAR_COLORS.length) + 1) - 1;
	var numA = Math.floor((Math.random() * AVATAR_IMAGES.length) + 1) - 1;
	var user = new models.User(
		{
			username: req.body.username,
			password: req.body.password,
			email: req.body.email,
			color: `${AVATAR_COLORS[numC]}`,
			avatar: `${config.get('STATIC_PATH')}/${AVATAR_IMAGES[numA]}.png`
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
