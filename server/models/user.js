var crypto = require('crypto');
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

schema.statics.findByParams = function(username, email) {
	var User = this;
	return User.findOne({username: username}).
		then(function(user) {
			if (!user) {
				return User.findOne({email: email});
			}
			return Promise.resolve(user);
		});
};

schema.statics.authorizeSocial = function(userData) {
	var User = this;
	/**
	 * 1. Получить пользователя с таким username из базы данных
	 * 2. Такой пользователь найден?
	 *      Да - сверить был ли он уже авторизован через сервис
	 *      Нет - создаем нового
	 * 3. Авторизация успешна
	 */
	return User.findOne({email: userData.email}).
		then(function(user) {
			var returnUser;
			if (user) {
				if (!user.checkIsSocialExist(userData.authType.name)) {
					user.authType.push(userData.authType);
					user.save();
				}

				returnUser = user;
			} else {
				returnUser = new User(userData);
				returnUser.save();
			}
			return returnUser;
		});
};

schema.statics.getUserByID = function(id) {
	return this.findById(id);
};

schema.statics.authorize = function(username, password) {
	/**
	 * 1. Получить пользователя с таким username из базы данных
	 * 2. Такой пользователь найден?
	 *      Да - сверить пароль вызовом user.checkPassword
	 *      Нет - ответ ошибки
	 * 3. Авторизация успешна?
	 */
	var User = this;

	return User.findOne({username: username}).
		then(function(user) {
			if (user) {
				if (user.checkPassword(password)) {
					return user;
				}
			}

			return Promise.reject(new AuthError('Пароль или логин не верен'));
		});
};

exports.User = mongoose.model('User', schema);
