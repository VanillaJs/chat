var mongoose = require('mongoose');
function getSystemMessage(mess, channelId) {
	var message = {
		_id: mongoose.Types.ObjectId(), /* eslint new-cap: 0 */
		message: mess,
		userId: 'Server (trolling) =)',
		channelId: channelId
	};
	return {
		status: true,
		channelId: channelId,
		userId: message.userId,
		message: message
	};
}

module.exports = getSystemMessage;
