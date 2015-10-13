/**
 * Created by timofey on 06.10.15.
 */
var mongoose = require('mongoose');
var inherit = require('inherit');
var userTypes = require('./../constants/user');
var Message = require('../../../models/message').Message;
var sendToAllSocket = require('../../../lib/sendselfsockets');
var assign = require('lodash/object/assign');
var UserModel = require('../../../models/user').User;
var config = require('./../../../config');
var sendStatus = require('../../../lib/channelstatus');
var checkDataByParams = require('./helper');
var User = inherit({
	/**
	 * @param {Object} socket.
	 * @param {Object} Users.
	 */
	__constructor: function(socket, Users) {
		this._socket = socket;
		this._users = Users;
		this._data = Users[socket.handshake.user._id];
	},
	/*
	 * Обработчики для данного типа событий
	 */
	_handlers: [
		{
			// обработчик сообщений (делает их прочитанными)
			name: userTypes.READ_MESSAGE,
			callback: function(data) {
				Message.setRead(data);
			}
		},
		{
			// обработчик обновления данных пользователя
			name: userTypes.UPDATE_DATA,
			callback: function(data) {
				var socket = this._socket;
				var users = this._users;
				UserModel.getUserByID(data._id).
					then(function(user) {
						delete data['_id'];
						assign(user, data);
						return user.save();
					}).then(function(user) {
						assign(users[socket.handshake.user._id].userData, user);
						sendToAllSocket(users[socket.handshake.user._id], 's.user.update_data', user);
					}).catch(function(err) {
						console.log(err);
					});
			}
		},
		{
			// обработчик для получения данных пользователем
			name: userTypes.GET_DATA,
			callback: function() {
				this._socket.emit('s.user.set_data', {data: this._data.userData, contacts: this._data.contacts});
			}
		},
		{
			// обработчик для получения сообщений для канала (постраничная)
			name: userTypes.MESSAGE_BY_ROOM,
			callback: function(data) {
				// data.channelId
				// data.page
				var socket = this._socket;
				Message.getListByParams(data.channelId, data.page).
					then(function(messages) {
						socket.emit('s.user.message_by_room', {data: messages.reverse()});
					}).catch(function(err) {
						console.log(err);
					});
			}
		},
		{
			// обработчик для отправки сообщения
			name: userTypes.SEND_MESSAGE,
			callback: function(message) {
				// var status = false;
				// save to database
				var sendMessage;
				if (message !== undefined) {
					sendMessage = this._sendMessage.bind(this);
					message.userId = this._socket.handshake.user._id;
					if (this._data.channel === config.get('defaultChannel')) {
						message._id = mongoose.Types.ObjectId(); /* eslint new-cap: 1 */
						message.message = message.text;
						message.userId = this._socket.handshake.user.username;
						sendMessage(true, message.channelId, message);
					} else {
						// пишем в базу
						Message.addNew(message).
							then(function(messageNew) {
								sendMessage(true, messageNew.channelId, messageNew);
							}).catch(function(err) {
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
	_sendMessage: function(status, channelId, message) {
		var sendData;
		var toUser = this._data.contacts[channelId];
		// Проверяем пользователь онлайн или нет
		if (toUser !== undefined && this._users.hasOwnProperty(toUser.user)) {
			// проверяем, что он не находится в этом канале
			if (this._users[toUser.user].channel.toString() !== channelId.toString()) {
				// отправляем ему сообщение
				sendStatus(this._socket.handshake.user._id, this._users, 's.user.send_private', toUser, {message_count: 1});
			} else {

				Message.update({_id: message._id}, { $push: { read: toUser.user } }, function(err, message) {
					console.log(err);
					console.log(message);
				});
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
