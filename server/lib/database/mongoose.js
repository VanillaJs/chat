var mongoose = require('mongoose');
var config = require('../../config');
require('../../models');

mongoose.connect(config.get('mongoose:uri'), config.get('mongoose:options'));

module.exports = mongoose;
