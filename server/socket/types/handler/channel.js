var inherit = require('inherit');
var config = require('./../../../config');
var channelTypes = require('./../constants/channel');
var sendStatus = require('../../../lib/channelstatus');
var User = require('../../../models/user').User;
var Channel = require('../../../models/channel').Channel;
var Message = require('../../../models/message').Message;
var joinAllSocket = require('../../../lib/sendselfsockets');
var getSystemMessage = require('../../../lib/getsystemmessage');
var sessionStore = require('./../../../lib/database/sessionStore');
var checkDataByParams = require('./helper');
var sendToAll = require('../../../lib/sendtoall');
var Channels = inherit({
	/**
	 * @param {Object} socket.
	 * @param {Object} Users.
	 */
	__constructor: function(socket, Users) {
		this._socket = socket;
		this._users = Users;
		this._session = socket.handshake.session;
		this._data = Users[socket.handshake.user._id];
	},
	/*
	 * Обработчики для данного типа событий
	 */
	_handlers: [
		{
			// обработчик послыает всем канал , что он оффлайн
			name: channelTypes.DISCONNECT,
			callback: function() {
				var index;
				if (this._data.soketData.length) {
					// проверяем какие сокеты уже отвалились
					for (index in this._data.soketData) {
						if (this._data.soketData[index].id === this._socket.id) {
							// удаляем их
							this._data.soketData.splice(index, 1);
						}
					}
				}
				if (this._data.soketData.length === 0) {
					sendStatus(this._socket.handshake.user._id, this._users, 's.channel.offline');
					delete this._socket[this._socket.handshake.user._id];
				}
			}
		},
		{
			// обработчик удалет канал
			name: channelTypes.DELETE_CHANNEL,
			callback: function(channel) {
				var userData = this._data;
				var socket = this._socket;
				var Users = this._users;
				var ifUserOnline = this._ifUserOnline;
				Channel.findOne({_id: channel.id}).remove(function(err, mess) {
					var sendObject = {id: channel.id, is_delete: mess.result.n === 1};
					var toUser;
					// Удаление сообщений по каналу
					Message.find({ channelId: { $in: [channel.id] } }).remove();
					if (ifUserOnline(userData.contacts[channel.id].user)) {
						toUser = userData.contacts[channel.id];
						sendStatus(socket.handshake.user._id, Users, 's.channel.delete', toUser);
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
			// обработчик при присоединениии к каналу
			name: channelTypes.JOIN_CHANNEL,
			callback: function(channelTo) {
				var mess = {};
				if (this._data.channel === config.get('defaultChannel')) {
					mess = getSystemMessage(this._socket.handshake.user.username + ' Left channel', config.get('defaultChannel'));
					sendToAll(this._users, 's.user.send_message', mess, this._socket.handshake.user._id, config.get('defaultChannel'));
				}
				this._socket.leave(this._data.channel);
				this._users[this._socket.handshake.user._id].channel = channelTo.id;
				// Обновление сессии
				this._updateChannel(this._session.id, channelTo.id);
				// добавил переключение по комнатам в одной сессии у всех пользователей
				joinAllSocket(this._users[this._socket.handshake.user._id], 's.channel.join', {channel: channelTo.id});
				if (channelTo.id === config.get('defaultChannel')) {
					mess = getSystemMessage(this._socket.handshake.user.username + ' Join channel (STOP TROLLING)', config.get('defaultChannel'));
					sendToAll(this._users, 's.user.send_message', mess, this._socket.handshake.user._id, config.get('defaultChannel'));
				}
				this._socket.emit('s.channel.join', {channel: channelTo.id});
			}
		},
		{
			// обработчик добавляет канал
			name: channelTypes.ADD_CHANNEL,
			callback: function(user) {
				var sendData = null;
				var promises = [];
				var socket = this._socket;
				var Users = this._users;
				var toUser;
				var ifUserOnline = this._ifUserOnline.bind(this);
				User.findByParams(user.username, user.username).
					then(function(user) {
						if (user) {
							toUser = user;
							return Channel.findOrCreate('user', socket.handshake.user._id, user._id);
						}
						return Promise.reject('User not fined!');
					}).then(function(channel) {
						if (channel !== undefined && !Users[socket.handshake.user._id].contacts.hasOwnProperty(channel._id)) {
							promises.push(Channel.prepareChannel(socket.handshake.user._id, channel, Users));

							if (ifUserOnline(toUser._id)) {
								promises.push(Channel.prepareChannel(toUser._id, channel, Users));
							}
							return Promise.all(promises);
						}
						return Promise.reject('Channel not created!');
					}).then(function(result) {
						sendData = result[0];
						Users[socket.handshake.user._id].contacts[sendData._id] = sendData;
						if (ifUserOnline(toUser._id) && result[1]) {
							Users[toUser._id].contacts[sendData._id] = result[1];
							sendStatus(socket.handshake.user._id, Users, 's.channel.add', sendData, Users[toUser._id].contacts[sendData._id]);
						}

						socket.emit('s.channel.add', {channel: sendData._id, custom: sendData});
					}).catch(function(err) {
						console.log(err);
					});
			}
		}
	],
	/*
	 *
	 */
	bindSocketEvents: function() {
		var self = this;
		var index;
		if (this._handlers.length > 0) {
			for (index in this._handlers) { /* eslint guard-for-in: 1 */
				(function(event, index, callback) { /* eslint no-loop-func: 1 */
					self._socket.on(event, function() {
						var args = arguments;
						var notError;
						// Для того чтобы привести к одноми виду
						if (!Object.keys(args).length) {
							args[0] = {};
						}
						// Проверяем все ли впорядке с входящими данными
						notError = self._dataIsCorrect(event, args[0]);
						if (notError === true) {
							callback.apply(self, args);
						} else {
							// новое событие об ошибке входящих данных
							self._socket.emit('s.server.error', {event: event, error: notError});
						}
					});
				})(this._handlers[index].name, index, this._handlers[index].callback);
			}
		}
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
	_ifUserOnline: function(id) {
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
