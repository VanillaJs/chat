var config = require("nconf");
var passport = require('passport');
var AuthLocalStrategy = require('passport-local').Strategy;
var config = require('./../config');//все прарметры конфига
var User = require('./../models/user').User;
var AuthError = require('./../models/user').AuthError;
var AuthFacebookStrategy = require('passport-facebook').Strategy;
//var AuthVKStrategy = require('passport-vkontakte').Strategy;

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
            "photos"
        ]
    },
    function (accessToken, refreshToken, profile, done) {

        console.log("facebook auth: ", profile);

        return done(null, {
            username: profile.displayName,
            photoUrl: profile.photos[0].value,
            profileUrl: profile.profileUrl
        });
    }
));
//
//passport.use('vk', new AuthVKStrategy({
//        clientID: config.get("auth:vk:app_id"),
//        clientSecret: config.get("auth:vk:secret"),
//        callbackURL: config.get("app:url") + "/auth/vk/callback"
//    },
//    function (accessToken, refreshToken, profile, done) {
//
//        //console.log("facebook auth: ", profile);
//
//        return done(null, {
//            username: profile.displayName,
//            photoUrl: profile.photos[0].value,
//            profileUrl: profile.profileUrl
//        });
//    }
//));

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