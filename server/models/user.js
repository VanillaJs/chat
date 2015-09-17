var crypto = require('crypto');
var async = require('async');
var util = require('util');

var mongoose = require('./../lib/database/mongoose'),
    Schema = mongoose.Schema;

// схема модели пользователя
var schema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    hashedPassword: {
        type: String,
        required: true
    },
    salt: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    }
});

schema.methods.encryptPassword = function (password) {
    return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
};

schema.virtual('password')
    .set(function (password) {
        this._plainPassword = password;
        this.salt = Math.random() + '';
        this.hashedPassword = this.encryptPassword(password);
    })
    .get(function () {
        return this._plainPassword;
    });

schema.methods.checkPassword = function (password) {
    return this.encryptPassword(password) === this.hashedPassword;
};

schema.statics.authorize = function (username, password, callback) {

    /**
     * 1. Получить пользователя с таким username из базы данных
     * 2. Такой пользователь найден?
     *      Да - сверить пароль вызовом user.checkPassword
     *      Нет - создать нового пользователя
     * 3. Авторизация успешна?
     *      Да - сохранить _id посетителя в сессию session.user = user._id и ответить 200
     *      Нет - вывести ошибку (403 или другую)
     */

    var User = this;

    async.waterfall([
        function (callback) {
            User.findOne({username: username}, callback);
        },
        function (user, callback) {
            if (user) {
                if (user.checkPassword(password)) {
                    callback(null, user)
                } else {
                    callback(new AuthError('Пароль не верен'));
                }
            } else {
                var new_user = new User({username: username, password: password});
                new_user.save(function (err) {
                    if (err) return callback(err);
                    callback(null, new_user);
                });
            }
        }
    ], callback);
};

exports.User = mongoose.model('User', schema);


//<editor-fold desc="ошибка авторизации">
function AuthError(message) {
    Error.apply(this, arguments);
    Error.captureStackTrace(this, AuthError);

    this.message = message;
}

util.inherits(AuthError, Error);

AuthError.prototype.name = 'AuthError';

exports.AuthError = AuthError;
//</editor-fold>