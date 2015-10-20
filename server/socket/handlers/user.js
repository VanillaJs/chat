var mongoose = require('mongoose');
var models = mongoose.models;
var inherit = require('inherit');
var userTypes = require('./constants/user');
var config = require('../../config');
var checkDataByParams = require('./helper');
var manager = require('../manager');

var User = inherit({
	/**
	 * @param {Object} socket.
	 */
	__constructor: function(socket) {
		this._socket = socket;
		this._user = manager.users.getById(socket.handshake.user._id);
		this.bindSocketEvents();
		socket.emit('s.user.set_user_id', socket.handshake.user._id);
	},
	/*
	 * Обработчики для данного типа событий
	 */
	_handlers: [
		{
			// обработчик сообщений (делает их прочитанными)
			name: userTypes.READ_MESSAGE,
			callback: function(data) {
				models.Message.setRead(data);
			}
		},
		{
			// обработчик обновления данных пользователя
			name: userTypes.UPDATE_DATA,
			callback: function(data) {
				models.User.getUserByID(data._id)
					.then(user => {
						delete data['_id']; /* eslint dot-notation: 0 */
						Object.assign(user, data);
						return user.save();
					})
					.then(user => {
						Object.assign(this._user.userData, user);
						manager.broadcastToUserSockets('s.user.update_data', this._user, user);
					})
					.catch(function(err) {
						console.log(err);
					});
			}
		},
		{
			// обработчик для получения данных пользователем
			name: userTypes.GET_DATA,
			callback: function() {
				this._socket.emit('s.user.set_data', {data: this._user.userData, contacts: this._user.contacts});
			}
		},
		{
			// обработчик для получения сообщений для канала (постраничная)
			name: userTypes.MESSAGE_BY_ROOM,
			callback: function(data) {
				// data.channelId
				// data.page
				var socket = this._socket;
				models.Message.getListByParams(data.channelId, data.page)
					.then(messages => {
						socket.emit('s.user.message_by_room', {data: messages.reverse()});
					})
					.catch(err => {
						console.log(err);
					});
			}
		},
		{
			// обработчик для отправки сообщения
			name: userTypes.SEND_MESSAGE,
			callback: function(message) {
				if (message !== undefined) {
					message.userId = this._socket.handshake.user._id;
					if (this._user.channel === config.get('DEFAULT_CHANNEL_ID')) {
						message._id = mongoose.Types.ObjectId(); /* eslint new-cap: 0 */
						message.message = message.text;
						message.userId = this._socket.handshake.user.username;
						this._sendMessage(true, message.channelId, message);
					} else {
						models.Message.addNew(message)
							.then(messageNew => {
								this._sendMessage(true, messageNew.channelId, messageNew);
							})
							.catch(function(err) {
								console.log(err);
							});
					}
				}
			}
		}
	],

	/*
	 * void
	 * Функция добаляет обработчики хранящиеся в _handlers
	 * только с фильром входящих данных,_dataIsCorrect где в switch втсавляем тип нашого события(constants)
	 * логика может быть любая
	 */
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
	_sendMessage: function(status, channelId, message) {
		var sendData;
		var toUser = this._user.contacts[channelId];
		// Проверяем пользователь онлайн или нет
		if (toUser && manager.users.has(toUser.user)) {
			// проверяем, что он не находится в этом канале
			if (manager.users.get(toUser.user).channel.toString() !== channelId.toString()) {
				// отправляем ему сообщение
				manager.sendStatus('s.user.send_private', this._socket.handshake.user._id, toUser, {message_count: 1});
			} else {
				models.Message.update({_id: message._id}, { $push: { read: toUser.user } })
					.then(message => console.log(message))
					.catch(err => console.log(err));
			}
		}

		sendData = {
			status: true,
			channelId: channelId,
			userId: message.userId,
			message: message
		};
		this._socket.emit('s.user.send_message', sendData);
		this._socket.broadcast.to(channelId).emit('s.user.send_message', sendData);
	},
	/**
	 * Функция для проверки фходящих данных
	 * является фильтом
	 * @param  {?}      event
	 * @param  {Object} data
	 * @return {Bool}
	 */
	_dataIsCorrect: function(event, data) {
		var mustKeys;
		switch (event) {
		case userTypes.SEND_MESSAGE:
			mustKeys = {message_type: 'String', channelId: 'ObjectId', text: 'String', userId: 'ObjectId'};
			break;
		case userTypes.MESSAGE_BY_ROOM:
			mustKeys = {channelId: 'ObjectId', page: 'Int'};
			break;
		case userTypes.READ_MESSAGE:
			mustKeys = {userId: 'ObjectId', messages: 'Array'};
			break;
		case userTypes.UPDATE_DATA:
			mustKeys = {_id: 'ObjectId', username: 'String', email: 'Email', avatar: 'String', color: 'String'};
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

module.exports = User;
