var mongoose = require('./../lib/database/mongoose'),
	Schema = mongoose.Schema;

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

exports.Channel = mongoose.model('MessageType', schema);
