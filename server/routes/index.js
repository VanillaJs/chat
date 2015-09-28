
var checkAuth = require('./../middleware/checkAuth');
var passport = require('./../lib/passport');

module.exports = function(app) {
	app.get('/', checkAuth, require('./frontpage').get);
	app.get('/login', require('./frontpage').get);
	app.post('/login', function(req, res) {
		passport.authenticate('local', function(err) {
			if (req.xhr) {
				if (err) {
					return res.json({ error: err.message });
				}

				return res.json({ error: null });
			}
		})(req, res);
	});
	app.get('/login-fb', passport.authenticate('facebook', {scope: 'email'}));
	app.get('/register', require('./frontpage').get);
	app.post('/register', require('./register').post);

	app.get('/login-fb-callback*',
			passport.authenticate('facebook',
				{
					successRedirect: '/',
					failureRedirect: '/login'
				}
			)
	);

	app.get('/login-vk',
		passport.authenticate('vk', {
			scope: ['email', 'friends']
		}),
		function() {
			// The request will be redirected to vk.com
			// for authentication, so
			// this function will not be called.
		});

	app.get('/login-vk-callback',
		passport.authenticate('vk', {
			successRedirect: '/',
			failureRedirect: '/login'
		}),
		function(req, res) {
			// Successful authentication
			// redirect home.
			res.redirect('/');
		});

	app.get('/logout', checkAuth, require('./logout').get);
};
