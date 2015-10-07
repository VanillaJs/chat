/**
 * Created by timofey on 06.10.15.
 */
var inherit = require('inherit');
var userTypes = require('./../constants/user');
var Message = require('../../../models/message').Message;
var config = require('./../../../config');
var sendStatus = require('../../../lib/channelstatus');
var User = inherit({
	/**
	 * @param {Object} socket.
	 * @param {Object} Users.
	 */
	__constructor: function (socket, Users) {
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
				Message.getListByParams(data.channelId, data.page, function(err, messages) {
					if (!err) {
						socket.emit('s.user.message_by_room', {data: messages.reverse()});
					}
				});
			}
		},
		{
			// обработчик для отправки сообщения
			name: userTypes.SEND_MESSAGE,
			callback: function(message) {
				// var status = false;
				// save to database
				if (message !== undefined) {
					var sendMessage = this._sendMessage.bind(this);
					message.userId = this._socket.handshake.user._id;
					if (this._data.channel === config.get('defaultChannel')) {
						message.message = message.text;
						message.userId = this._socket.handshake.user.username;
						sendMessage(true, message.channelId, message);
					} else {
						// пишем в базу
						Message.addNew(message, function(err, messageNew) {
							if (!err) {
								sendMessage(true, messageNew.channelId, messageNew);
							} else {
								console.log(err);
							}
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
			for (index in this._handlers) {
				(function(event, index, callback) {
					self._socket.on(event, function () {
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
	_sendMessage: function(status, channelId, message) {
		var sendData;
		var toUser = this._data.contacts[channelId];
		// Проверяем пользователь онлайн или нет
		if (toUser !== undefined && this._users.hasOwnProperty(toUser.user)) {
			// проверяем, что он не находится в этом канале
			if (this._users[toUser.user].channel.toString() !== channelId.toString()) {
				// отправляем ему сообщение
				sendStatus(this._socket.handshake.user._id, this._users, 's.user.send_private', toUser, {message_count: 1});
			}
		}

		sendData = {
			status: true,
			chnnelId: channelId,
			userId: message.userId,
			message: message
		};
		this._socket.broadcast.to(channelId).emit('s.user.send_message', sendData);
	},
	/*
	 * Фйнкци для проверки фходящих данных
	 */
	_dataIsCorrect: function(event, data) {
		switch (event) {
		case userTypes.SEND_MESSAGE:
			return true;
		default:
			return true;
		}
	}
});

module.exports = User;
