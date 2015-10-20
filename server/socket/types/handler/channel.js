var inherit = require('inherit');
var models = require('mongoose').models;
var channelTypes = require('../constants/channel');
var sessionStore = require('../../../lib/database/sessionStore');
var checkDataByParams = require('./helper');
var manager = require('../../manager');

var Channels = inherit({
	/**
	 * @param {Object} socket.
	 * @param {Object} Users.
	 */
	__constructor: function(socket) {
		this._socket = socket;
		this._user = manager.users.getById(socket.handshake.user._id);
		this._session = socket.handshake.session;
	},
	_handlers: [
		{
			name: channelTypes.DISCONNECT,
			callback: function() {
				var sockets = this._user.sockets;
				if (sockets.length) {
					sockets = sockets.filter(socket => socket.id !== this._socket.id);
					this._user.sockets = sockets;
				}
				if (sockets.length === 0) {
					manager.sendStatus('s.channel.offline', this._socket.handshake.user._id);
					manager.users.remove(this._socket.handshake.user._id);
				}
			}
		},
		{
			name: channelTypes.DELETE_CHANNEL,
			callback: function(channel) {
				var userData = this._user;
				var socket = this._socket;
				models.Channel.findOne({_id: channel.id}).remove()
					.then(mess => {
						var sendObject = {id: channel.id, is_delete: mess.result.n === 1};
						var toUser;
						models.Message.find({ channelId: { $in: [channel.id] } }).remove();
						if (this.isUserOnline(userData.contacts[channel.id].user)) {
							toUser = userData.contacts[channel.id];
							manager.sendStatus('s.channel.delete', socket.handshake.user._id, toUser);
						}

						/*
						 * нужно добавить логику при удалении чтобы он менял канал на дефолтный
						 */

						// И удаляем из глобального объекта пользователя данный контакт
						delete Users[socket.handshake.user._id].contacts[channel.id];

						socket.emit('s.channel.delete', sendObject);
					});
			}
		},
		{
			name: channelTypes.JOIN_CHANNEL,
			callback: function(channelTo) {
				this._socket.leave(this._user.channel);
				this._user.channel = channelTo.id;
				this._updateChannel(this._session.id, channelTo.id);
				manager.joinAllSocket('s.channel.join', this._user, {channel: channelTo.id});
			}
		},
		{
			// обработчик добавляет канал
			name: channelTypes.ADD_CHANNEL,
			callback: function(user) {
				var socket = this._socket;
				var toUser;
				models.User
					.findByParams(user.username, user.username)
					.then(function(user) {
						if (user) {
							toUser = user;
						} else {
							throw new Error('User not found');
						}
						return models.Channel.findOrCreate('user', socket.handshake.user._id, user._id);
					})
					.then(channel => {
						var promises = [];
						if (channel && !this._user.hasContact(channel._id)) {
							promises.push(Channel.prepareChannel(socket.handshake.user._id, channel));

							if (this.isUserOnline(toUser._id)) {
								promises.push(Channel.prepareChannel(toUser._id, channel));
							}
							return Promise.all(promises);
						}
					})
					.then(result => {
						var sendData = result[0];
						Users[socket.handshake.user._id].contacts[sendData._id] = sendData;
						if (this.isUserOnline(toUser._id) && result[1]) {
							Users[toUser._id].contacts[sendData._id] = result[1];
							manager.sendStatus('s.channel.add', socket.handshake.user._id, sendData, Users[toUser._id].contacts[sendData._id]);
						}

						socket.emit('s.channel.add', {channel: sendData._id, custom: sendData});
					})
					.catch(function(err) {
						socket.emit('s.channel.add', null);
						console.log(err);
					});
			}
		}
	],
	bindSocketEvents: function() {
		var _this = this;
		_this._handlers.forEach(handler => {
			_this._socket.on(handler.name, function() {
				var args = arguments;
				var notError;
				if (!Object.keys(args).length) {
					args[0] = {};
				}
				notError = _this._dataIsCorrect(handler.name, args[0]);
				if (notError === true) {
					handler.callback.apply(_this, args);
				} else {
					_this._socket.emit('s.server.error', {event: handler.name, error: notError});
				}
			});
		});
	},
	/*
	 * Функция обноваляет сессию
	 */
	_updateChannel: function(sessionId, value) {
		// Через попу, но пока работает )
		sessionStore.load(sessionId, function(err, session) {
			if (session !== undefined) {
				session.passport.user.channel = value;
				session.reload(function() {
					session.touch().save();
				});
			}
		});
	},
	isUserOnline: function(id) {
		return this._users.hasOwnProperty(id);
	},
	/*
	 * Функция для проверки фходящих данных
	 * является вильтом
	 * @return {Bool}
	 */
	_dataIsCorrect: function(event, data) {
		var mustKeys;
		switch (event) {
		case channelTypes.JOIN_CHANNEL:
			mustKeys = {id: 'ObjectId'};
			break;
		case channelTypes.DELETE_CHANNEL:
			mustKeys = {id: 'ObjectId'};
			break;
		case channelTypes.ADD_CHANNEL:
			mustKeys = {username: 'String'};
			break;
		default:
			mustKeys = {};
		}

		if (Object.keys(mustKeys).length > 0) {
			return checkDataByParams(data, mustKeys);
		}
		return true;
	}
});


module.exports = Channels;
