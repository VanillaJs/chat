var UserCollection = require('./user_collection');

function Manager() {
	this.users = new UserCollection();
	this.handlers = {};
}

Object.assign(
	Manager.prototype,
	{
		registerHandlers: function(socketId, handlers) {
			this.handlers[socketId] = handlers;
			return this.handlers[socketId];
		},

		emit: function(eventName, user, channelId, additionalData) {
			if (user.sockets && user.sockets.length) {
				user.sockets.forEach(socket => {
					var sendData = {channel: channelId};

					if (additionalData) {
						sendData.custom = additionalData;
					}

					socket.emit(eventName, sendData);
				});
			}
		},

		sendToAll(event, data, id, channel) {
			const users = this.users.getAll();
			Object.keys(users)
				.filter(key => users[key].channel === channel)
				.forEach(key => {
					users[key].sockets
						.forEach(socket => {
							if (socket.handshake.user._id !== id) {
								socket.emit(event, data);
							}
						});
				});
		},

		broadcastToUserSockets: function(eventName, user, sendData) {
			if (user.sockets && user.sockets.length) {
				user.sockets.forEach(socket => {
					socket.join(user.channel);
					socket.emit(eventName, sendData);
				});
			}
		},

		sendStatus: function(eventName, id, toChannel, additionalData) {
			var user = this.users.get(id);
			if (!user) {
				return;
			}
			if (!toChannel) {
				Object.keys(user.contacts).forEach(key => {
					if (user.contacts[key].type === 'user') {
						const userId = user.contacts[key].user;
						if (this.users.has(userId)) {
							this.emit(eventName, this.users.get(userId), key, additionalData);
						}
					}
				});
			} else {
				if (this.users.has(toChannel.user)) {
					this.emit(eventName, this.users.get(toChannel.user), toChannel._id, additionalData);
				}
			}
		}
	}
);

module.exports = new Manager();
