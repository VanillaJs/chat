var User = require('./../models/user').User;
var AuthError = require('./../models/user').AuthError;
var HttpError = require('./../error').HttpError;
var passport = require('./../lib/passport');

exports.post = function(req, res, next) {
	var user = new User({ username: req.body.username, password: req.body.password, email: req.body.email});
	user.save(function(err) {
		return err
			? next(err)
			: passport.authenticate('local')(req, res, function () {
				res.redirect('/');
			});
	});
};

exports.get = function (req, res) {
	res.render('register');
};
