var mongoose = require('./../lib/database/mongoose');
var Schema = mongoose.Schema;

// схема модели Типов сообщений
var schema = new Schema({
	name: {
		type: String,
		required: true
	},
	type: {
		type: String,
		required: true
	}
});

schema.statics.findByType = function(type) {
	return this.findOne({type: type});
};

schema.statics.getById = function(id) {
	return this.findOne({'_id': id});
};

exports.MessageType = mongoose.model('MessageType', schema);
