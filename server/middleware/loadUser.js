var User = require('./../models/user').User;

module.exports = function (req, res, next) {
    req.user = res.locals.user = null;

    if (req.session.passport === undefined || !req.session.passport.user.user_id) return next();

    User.findById(req.session.passport.user.user_id, function (err, user) {
        if (err) return next(err);

        req.user = res.locals.user = user;
        next();
    });
};
