var inherit = require('inherit');
var channelTypes = require('./../constants/channel');
var sendStatus = require('../../../lib/channelstatus');
var User = require('../../../models/user').User;
var Channel = require('../../../models/channel').Channel;
var Message = require('../../../models/message').Message;
var joinAllSocket = require('../../../lib/sendselfsockets');
var sessionStore = require('./../../../lib/database/sessionStore');
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
				this._socket.leave(this._data.channel);
				this._users[this._socket.handshake.user._id].channel = channelTo.id;
				// Обновление сессии
				this._updateChannel(this._session.id, channelTo.id);
				// добавил переключение по комнатам в одной сессии у всех пользователей
				joinAllSocket(this._users[this._socket.handshake.user._id], 's.channel.join', {channel: channelTo.id});
				this._socket.emit('s.channel.join', {channel: channelTo.id});
			}
		},
		{
			// обработчик добавляет канал
			name: channelTypes.ADD_CHANNEL,
			callback: function(user) {
				var sendData = null;
				var socket = this._socket;
				var Users = this._users;
				var ifUserOnline = this._ifUserOnline.bind(this);
				User.findByParams(user.username, user.username, function(err, user) {
					var toUser;
					if (user) {
						if (err) {
							// ошибка
						} else {
							// Если канал существует
							Channel.findOrCreate('user', socket.handshake.user._id, user._id, function(err, channel) {
								if (!err) {
									sendData = Channel.prepareChannel(socket.handshake.user._id, channel, Users);
									Users[socket.handshake.user._id].contacts[sendData._id] = sendData;
									if (ifUserOnline(user._id)) {
										Users[user._id].contacts[sendData._id] = Channel.prepareChannel(user._id, channel, Users);
									}
								}

								if (channel) {
									// Таймаут для того, что данные по пользователю приходят асинхронно
									setTimeout(function() {
										Users[socket.handshake.user._id].contacts[sendData._id] = sendData;
										toUser = sendData;
										if (ifUserOnline(user._id)) {
											sendStatus(socket.handshake.user._id, Users, 's.channel.add', toUser, Users[user._id].contacts[sendData._id]);
										}

										socket.emit('s.channel.add', {channel: sendData._id, custom: sendData});
									}, 50);
								}
							});
						}
					} else {
						// пользователь не найден
						socket.emit('s.channel.add', sendData);
					}
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
						// Для того чтобы привести к одноми виду
						if (!Object.keys(args).length) {
							args[0] = {};
						}
						// Проверяем все ли впорядке с входящими данными
						if (self._dataIsCorrect(event, args[0])) {
							callback.apply(self, args);
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
	_dataIsCorrect: function(event) {
		switch (event) {
		default:
			return true;
		}
	}
});


module.exports = Channels;
