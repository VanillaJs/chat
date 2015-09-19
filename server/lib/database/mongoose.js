var mongoose = require('mongoose');
var config = require('./../../config');
console.log();
mongoose.connect(config.get('mongoose:uri'), config.get('mongoose:options'));

module.exports = mongoose;