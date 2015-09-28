var assert = require("assert");
var directoryServer = "./../../server/";
var Message = require(directoryServer + "models/message").Message;
describe('model/user.js', function() {
	describe('#addNew()', function () {
		it('should save without error', function (done) {
			var message = {room_id:'56082da97b02f2c4016c1b51', message_type:'text', "user_id" :'56082da97b02a2c4016k1b51', text:'test345'};
			Message.addNew(message, function(err, messageNew) {
				if (err) throw err;

				messageNew.remove();
				done();
			});
		});
	});
});
