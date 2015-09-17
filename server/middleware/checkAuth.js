var HttpError = require('./../error').HttpError;

module.exports = function (req, res, next) {
    if(req.session.passport === undefined || !req.session.passport.user.user_id) {
        return next(new HttpError(401, 'Вы не авторизованы'));
    }

    next();
};