var log = require('./../lib/log')(module);
var async = require('async');
var config = require('./../config');
var cookieParser = require('cookie-parser');
var sessionStore = require('./../lib/database/sessionStore');
var HttpError = require('./../error').HttpError;
var User = require('./../models/user').User;
var Users = {}; //Глобальный объект с пользователями и подключенными сокетами
var guestNumber = 1;
var nickNames = {};
var namesUsed = [];
var currentRoom = {};

function loadSession(sid, callback) {
    sessionStore.load(sid, function (err, session) {
        if (arguments.length == 0) {
            //no arguments => no session
            return callback(null, null);
        } else {
            return callback(null, session);
        }
    });
}

function loadUser(session, callback) {
    if (!session.passport.user.user_id) {
        return callback(null, null);
    }

    User.findById(session.passport.user.user_id, function (err, user) {
        if (err) return callback(err);

        if (!user) {
            return callback(null, null);
        }

        callback(null, user);
    })
}

module.exports = function (server) {

    var secret = config.get('session:secret');
    var sessionKey = config.get('session:key');
	var ioc = require('socket.io-client');
    var io = require('socket.io').listen(server);

    var disconnectRoom = function (name) {
        name = '/' + name;

        var users = io.manager.rooms[name];

        for (var i = 0; i < users.length; i++) {
            io.sockets.socket(users[i]).disconnect();
        }

        return this;
    };

    io.set('origins', config.get('app:socketOrigin'));
    io.set('logger', log);
    io.use(function (socket, next) {
        var handshakeData = socket.request;
        async.waterfall([
            function (callback) {
                //получить sid
                var parser = cookieParser(secret);
                parser(handshakeData, {}, function (err) {
                    if (err) return callback(err);

                    var sid = handshakeData.signedCookies[sessionKey];

                    loadSession(sid, callback);
                });
            },
            function (session, callback) {
                if (!session) {
                    return callback(new HttpError(401, "No session"));
                }

                socket.handshake.session = session;
                loadUser(session, callback);
            },
            function (user, callback) {
                if (!user) {
                    return callback(new HttpError(403, "Anonymous session may not connect"));
                }
                callback(null, user);
            }
        ], function (err, user) {

            if (err) {
                if (err instanceof HttpError) {
                    return next(new Error('not authorized'));
                }
                next(err);
            }

            socket.handshake.user = user
            //Если пользователь уже присутствует
            if(Users.hasOwnProperty(user._id)){
                if(Users[user._id].soketData.length)
                {
                    //проверяем какие сокеты уже отвалились
                    for(index in Users[user._id].soketData)
                    {
                        if(Users[user._id].soketData[index].disconnected)
                        {
                            //удаляем их
                            Users[user._id].soketData.splice(index,1);
                        }
                    }
                }
                //добавляем текущее соединение
                Users[user._id].soketData.push(socket);
                console.log(Users[user._id].soketData.length);
            }
            else
            {
                //Если пользователя нет , то добавляем его
                var sockets = [];
                sockets.push(socket);
                var putData = {userData: user, soketData:sockets};
                Users[user._id] = putData;
            }

            next();

        });

    });


    io.on('connection', function (socket) {

		guestNumber = assignGuestName(socket, guestNumber,
			// Присваивание подключившемуся пользователю имени guest
			nickNames, namesUsed);
		// Помещение подключившегося пользователя в комнату Lobby
		joinRoom(socket, 'Lobby');
		// Обработка пользовательских сообщений, попыток изменения имени
		// и попыток создания/изменения комнат
		handleMessageBroadcasting(socket, nickNames);
		handleNameChangeAttempts(socket, nickNames, namesUsed);
		handleRoomJoining(socket);
		// Вывод списка занятых комнат по запросу пользователя
		socket.on('rooms', function() {
			socket.emit('rooms', io.sockets.manager.rooms);
		});
		// Определение логики очистки, выполняемой после выхода
		// пользователя из чата
		handleClientDisconnection(socket, nickNames, namesUsed);
    });

	function assignGuestName(socket, guestNumber, nickNames, namesUsed) {
		// Создание нового гостевого имени
		var name = 'Guest' + guestNumber;
		// Связывание гостевого имени с идентификатором клиентского подключения
		nickNames[socket.id] = name;
		// Сообщение пользователю его гостевого имени
		socket.emit('nameResult', {
			success: true,
			name: name
		});
		// Обратите внимание, что гостевое имя уже используется sd
		namesUsed.push(name);
		// Для генерирования гостевых имен применяется счетчик с приращением
		return guestNumber + 1;
	};

	function joinRoom(socket, room) {
		// Вход пользователя в комнату чата
		socket.join(room);
		// Обнаружение пользователя в данной комнате
		currentRoom[socket.id] = room;
		// Оповещение пользователя о том, что он находится в новой комнате
		socket.emit('joinResult', {room: room});
		// Оповещение других пользователей о появлении нового
		// пользователя в комнате чата
		socket.broadcast.to(room).emit('message', {
			text: nickNames[socket.id] + ' has joined ' + room + '.'
		});
		// Идентификация других пользователей, находящихся в той же
// комнате, что и пользователь
		var usersInRoom = io.sockets.clients(room);
// Если другие пользователи присутствуют в данной
// комнате чата, просуммировать их
		if (usersInRoom.length > 1) {
			var usersInRoomSummary = 'Users currently in ' + room + ': ';
			for (var index in usersInRoom) {
				var userSocketId = usersInRoom[index].id;
				if (userSocketId != socket.id) {
					if (index > 0) {
						usersInRoomSummary += ', ';
					}
					usersInRoomSummary += nickNames[userSocketId];
				}
			}
			usersInRoomSummary += '.';
			// Вывод отчета о других пользователях, находящихся в комнате
			socket.emit('message', {text: usersInRoomSummary});
		}
	}

	function handleNameChangeAttempts(socket, nickNames, namesUsed) {
		// Добавление слушателя событий nameAttempt
		socket.on('nameAttempt', function(name) {
			// Не допускаются имена, начинающиеся с Guest
			if (name.indexOf('Guest') == 0) {
				socket.emit('nameResult', {
					success: false,
					message: 'Names cannot begin with "Guest".'
				});
			} else {
				// Если имя не используется, выберите его
				if (namesUsed.indexOf(name) == -1) {
					var previousName = nickNames[socket.id];
					var previousNameIndex = namesUsed.indexOf(previousName);
					namesUsed.push(name);
					nickNames[socket.id] = name;
					// Удаление ранее выбранного имени, которое
					// освобождается для других клиентов
					delete namesUsed[previousNameIndex];
					socket.emit('nameResult', {
						success: true,
						name: name
					});
					socket.broadcast.to(currentRoom[socket.id]).emit('message', {
						text: previousName + ' is now known as ' + name + '.'
					});
				} else {
					socket.emit('nameResult', {
						// Если имя зарегистрировано, отправка клиенту
						// сообщения об ошибке
						success: false,
						message: 'That name is already in use.'
					});
				}
			}
		});
	}

	function handleMessageBroadcasting(socket) {
		socket.on('message', function (message) {
			socket.broadcast.to(message.room).emit('message', {
				text: nickNames[socket.id] + ': ' + message.text
			});
		});
	}

	function handleRoomJoining(socket) {
		socket.on('join', function(room) {
			socket.leave(currentRoom[socket.id]);
			joinRoom(socket, room.newRoom);
		});
	}

	function handleClientDisconnection(socket) {
		socket.on('disconnect', function() {
			var nameIndex = namesUsed.indexOf(nickNames[socket.id]);
			namesUsed.splice(nameIndex,1);
			delete nickNames[socket.id];
		});
	}

    return io;
};
