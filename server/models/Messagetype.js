var mongoose = require('../lib/database/mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
	name: {
		type: String,
		required: true
	},
	type: {
		type: String,
		enum: ['text', 'image', 'audio'],
		required: true
	}
});

schema.statics.findByType = function(type) {
	return this.findOne({type: type});
};

schema.statics.getById = function(id) {
	return this.findOne({'_id': id});
};

module.exports = mongoose.model('MessageType', schema);
