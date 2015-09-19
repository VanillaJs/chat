var config = require("nconf");
var passport = require('passport');
var AuthLocalStrategy = require('passport-local').Strategy;
var config = require('./../config');//все прарметры конфига
var User = require('./../models/user').User;
var HttpError = require('./../error').HttpError;
var AuthError = require('./../models/user').AuthError;

var AuthFacebookStrategy = require('passport-facebook').Strategy;
var AuthVKStrategy = require('passport-vkontakte').Strategy;

passport.use('local', new AuthLocalStrategy(
    function (username, password, done) {


        User.authorize(username, password, function (err, user) {

            if (err) {
                if (err instanceof AuthError) {
                    return done(new HttpError(403, err.message));
                } else {
                    return done(err);
                }
            }
            return done(null, {
                user_id:user._id,
                username: user.username,
                photoUrl: "url_to_avatar",
                profileUrl: "url_to_profile"
            });
        });
    }
));

passport.use('facebook', new AuthFacebookStrategy({
        clientID: config.get("passport:facebook:clientID"),
        clientSecret: config.get("passport:facebook:clientSecret"),
        callbackURL: config.get("app:serverUrl") + "/login-fb-callback",
        profileFields: [
            'id',
            'displayName',
            'profileUrl',
            "photos",
			"email"
        ]
    },
    function (accessToken, refreshToken, profile, done) {

		var userData =
		{
			username: profile._json.name,
			password: profile._json.name+profile._json.link,
			email:profile._json.email,
			avatar:profile._json.picture.data.url,
			authType:{name:"facebook", idType: profile._json.id}

		};
		User.authorizeSocial( userData, function (err, user) {

			if (err) {
				if (err instanceof AuthError) {
					return done(new HttpError(403, err.message));
				} else {
					return done(err);
				}
			}
			console.log(user);
			return done(null, {
				user_id:user._id,
				username: user.username,
				photoUrl: "url_to_avatar",
				profileUrl: "url_to_profile"
			});
		});

    }
));

passport.use('vk', new AuthVKStrategy({
        clientID: config.get("passport:vk:app_id"),
        clientSecret: config.get("passport:vk:secret"),
        callbackURL: config.get("app:serverUrl") + "/login-vk-callback",
		apiVersion:'5.8',
		profileFields: [
			'id',
			'displayName',
			'profileUrl',
			"photos",
			"email"
		]
    },
    function (accessToken, refreshToken, profile, done) {

		var userData =
		{
			username: profile.username,
			password: profile.username+profile.profileUrl,
			email:"",
			avatar:profile._json.photo,
			authType:{name:"vk", idType: profile._json.id}

		};
		User.authorizeSocial( userData, function (err, user) {

			if (err) {
				if (err instanceof AuthError) {
					return done(new HttpError(403, err.message));
				} else {
					return done(err);
				}
			}
			return done(null, {
				user_id:user._id,
				username: user.username,
				photoUrl: "url_to_avatar",
				profileUrl: "url_to_profile"
			});
		});
    }
));

passport.serializeUser(function (user, done) {
    done(null, user);
});


passport.deserializeUser(function (data, done) {
    try {
        done(null, data);
    } catch (e) {
        done(e.err)
    }
});

module.exports = passport;
