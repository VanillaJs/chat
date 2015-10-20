/* global describe it*/
var directoryServer = './../../server/';
var mongoose = require('mongoose');
var config = require(directoryServer + 'config');

describe('mongoose', function() {
	describe('connection to mongo', function() {
		it('should coonect to mongo', function(done) {
			if (mongoose.connection._readyState === 0) {
				// если _readyState === , то подключеня к базе нет
				mongoose.connect(config.get('mongoose:uri'), done);
			} else {
				done();
			}
		});
	});
});
