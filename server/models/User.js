var crypto = require('crypto');
var mongoose = require('../lib/database/mongoose');
var Schema = mongoose.Schema;
var AuthError = require('../error').AuthError;

var schema = new Schema(
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

if (!schema.options.toObject) schema.options.toObject = {};
schema.options.toObject.transform = function(doc, ret) {
	delete ret.hashedPassword;
	delete ret.salt;
	delete ret.__v;
};

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
	return User.findOne({username: { $regex: username, $options: '-i'}}).
		then(function(user) {
			if (!user) {
				return User.findOne({email: { $regex: email, $options: '-i'}});
			}
			return Promise.resolve(user);
		});
};

schema.statics.authorizeSocial = function(userData) {
	var User = this;
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
	var User = this;

	return User.findOne({username: username})
		.then(function(user) {
			if (user) {
				if (user.checkPassword(password)) {
					return user;
				}
			}

			return Promise.reject(new AuthError('Login or password is incorrect'));
		});
};

module.exports = mongoose.model('User', schema);
