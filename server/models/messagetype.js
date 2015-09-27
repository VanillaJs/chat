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

exports.MessageType = mongoose.model('MessageType', schema);
