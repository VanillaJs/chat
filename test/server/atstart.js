var assert = require("assert");
var directoryServer = "./../../server/";
var mongoose = require('mongoose');
var config = require(directoryServer + 'config');

describe('mongoose', function() {
	describe('connection to mongo', function () {
		it('should coonect to mongo', function (done) {
			if(mongoose.connection.db)
			{
				done();
			} else {
				mongoose.connect(config.get('mongoose:uri'), done);
			}
		});
	});

});
