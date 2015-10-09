var crypto = require('crypto');
var async = require('async');
var util = require('util');
var mongoose = require('./../lib/database/mongoose');
var Schema = mongoose.Schema;

var schema;

// <editor-fold desc='ошибка авторизации'>
function AuthError(message) {
	Error.apply(this, arguments);
	Error.captureStackTrace(this, AuthError);

	this.message = message;
}

util.inherits(AuthError, Error);

AuthError.prototype.name = 'AuthError';

exports.AuthError = AuthError;
// </editor-fold>

// схема модели пользователя
schema = new Schema(
	{
		username: {
			type: String,
			unique: true,
			index: true,
			required: true
		},
		avatar: {
			type: String,
			required: false
		},
		email: {
			type: String,
			unique: true,
			index: true,
			required: false
		},
		hashedPassword: {
			type: String,
			required: true
		},
		salt: {
			type: String,
			required: true
		},
		color: {
			type: String,
			required: false
		},
		created: {
			type: Date,
			default: Date.now
		},
		lastActivity: {
			type: Date,
			default: Date.now
		},
		authType: {
			type: [{
				name: {
					type: String,
					required: true
				},
				idType: {
					type: String,
					required: true
				}
			}]
		}
	}
);

schema.methods.encryptPassword = function(password) {
	return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
};

schema.virtual('password')
		.set(function(password) {
			this._plainPassword = password;
			this.salt = Math.random() + '';
			this.hashedPassword = this.encryptPassword(password);
		})
		.get(function() {
			return this._plainPassword;
		});

schema.methods.checkPassword = function(password) {
	return this.encryptPassword(password) === this.hashedPassword;
};

schema.methods.checkIsSocialExist = function(type) {
	var ret = false;
	this.authType.forEach(function(aType) {
		if (aType.name === type) {
			ret = true;
			return;
		}
	});
	return ret;
};

schema.statics.findByParams = function(username, email, callback) {
	var User = this;
	async.waterfall([
		function(callback) {
			User.findOne({username: username}, callback);
		},
		function(user, callback) {
			if (user) {
				callback(null, user);
			} else {
				if (email !== null && email.length) {
					User.findOne({email: email}, callback);
				}
			}
		},
		function(user, callback) {
			if (user) {
				callback(null, user);
			} else {
				callback('not found', null);
			}
		}], callback);
};

schema.statics.authorizeSocial = function(userData, callback) {
	var User = this;
	/**
	 * 1. Получить пользователя с таким username из базы данных
	 * 2. Такой пользователь найден?
	 *      Да - сверить был ли он уже авторизован через сервис
	 *      Нет - создаем нового
	 * 3. Авторизация успешна
	 */
	async.waterfall([
		function(callback) {
			User.findOne({email: userData.email}, callback);
		},
		function(user, callback) {
			var newUser;
			if (user) {
				if (user.checkIsSocialExist(userData.authType.name)) {
					callback(null, user);
				} else {
					user.authType.push(userData.authType);
					user.save();
				}
			} else {
				newUser = new User(userData);
				newUser.save(function(err) {
					if (err) {
						return callback(err);
					}
					callback(null, newUser);
				});
			}
		}
	], callback);
};

schema.statics.getUserByID = function(id, callback) {
	var User = this;

	async.waterfall([
		function(callback) {
			User.findById(id, callback);
		},
		function(user, callback) {
			if (user) {
				callback(null, user);
			} else {
				callback('User is not fined!');
			}
		}
	], callback);
};

schema.statics.authorize = function(username, password, callback) {
	/**
	 * 1. Получить пользователя с таким username из базы данных
	 * 2. Такой пользователь найден?
	 *      Да - сверить пароль вызовом user.checkPassword
	 *      Нет - ответ ошибки
	 * 3. Авторизация успешна?
	*/
	var User = this;

	async.waterfall([
		function(callback) {
			User.findOne({username: username}, callback);
		},
		function(user, callback) {
			if (user) {
				if (user.checkPassword(password)) {
					callback(null, user);
				} else {
					callback(new AuthError('Пароль не верен'));
				}
			} else {
				callback(new AuthError('Пароль или логин не верен'));
			}
		}
	], callback);
};

exports.User = mongoose.model('User', schema);
