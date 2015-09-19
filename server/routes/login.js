var User = require('./../models/user').User;
var AuthError = require('./../models/user').AuthError;
var HttpError = require('./../error').HttpError;
var passport = require('./../lib/passport');

exports.get = function (req, res) {
    res.render('login');
};

//exports.post = function (req, res, next) {
//    var username = req.body.username;
//    var password = req.body.password;
//    ',
//        failureFlash: true };
//    User.authorize(username, password, function (err, user) {
//        if (err) {
//            if (err instanceof AuthError) {
//                return next(new HttpError(403, err.message));
//            } else {
//                return next(err);
//            }
//        }
//
//        req.session.user = user._id;
//        req.session.custom = user;
//        res.send({});
//    });
//};