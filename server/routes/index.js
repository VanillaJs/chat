
var User = require('./../models/user').User;
var HttpError = require('./../error').HttpError;
var checkAuth = require('./../middleware/checkAuth');
var passport = require('./../lib/passport');

module.exports = function (app) {

    app.get('/', checkAuth, require('./frontpage').get);
    app.get('/login', require('./login').get);
    app.post('/login', passport.authenticate('local', {
            successRedirect: '/',
            failureRedirect: '/login',
            failureFlash: true}
        )
    );
    app.get('/login-fb', passport.authenticate('facebook', {
                scope: 'email'
            }
        )
    );
    app.get('/login-fb-callback*',
        passport.authenticate('facebook', {
            successRedirect: '/',
            failureRedirect: '/login' })
    );
    app.post('/logout', require('./logout').post);

};
