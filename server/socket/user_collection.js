function User(data) {
	this.userData = data.userData;
	this.channel = data.channel;
	this.sockets = [data.socket];
}

Object.assign(User.prototype, {
	updateSockets: function() {
		this.socketList = this.socketList.filter(socket => !socket.disconnected);
	},
	hasContact: function(userId) {
		return this.contacts.hasOwnProperty(userId);
	}
});

module.exports = User;

function UserCollection() {
	this.collection = {};
}

Object.assign(UserCollection.prototype, {
	get: function(userId) {
		return this.has(userId) ? this.collection[userId] : null;
	},
	getById: function(userId) {
		return this.has(userId) ? this.collection[userId] : null;
	},
	getAll: function() {
		return this.collection;
	},
	has: function(userId) {
		return this.collection.hasOwnProperty(userId);
	},
	create: function(userId, data) {
		this.collection[userId] = new User(data);
		return this.collection[userId];
	},
	remove: function(userId) {
		this.collection[userId] = null;
		delete this.collection[userId];
	}
});

module.exports = UserCollection;
