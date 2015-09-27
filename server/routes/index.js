
var checkAuth = require('./../middleware/checkAuth');
var passport = require('./../lib/passport');

module.exports = function(app) {
	app.get('/', checkAuth, require('./frontpage').get);
	app.get('/login', require('./login').get);
	app.post('/login', passport.authenticate('local',
		{
			successRedirect: '/',
			failureRedirect: '/login',
			failureFlash: true
		})
	);
	app.get('/login-fb', passport.authenticate('facebook', {scope: 'email'}));
	app.get('/register', require('./register').get);
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
