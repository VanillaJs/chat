var log = require('./../lib/log')(module);
var async = require('async');
var config = require('./../config');
var cookieParser = require('cookie-parser');
var sessionStore = require('./../lib/database/sessionStore');
var HttpError = require('./../error').HttpError;
var User = require('./../models/user').User;
var Users = {}; //Глобальный объект с пользователями и подключенными сокетами
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
    var io = require('socket.io').listen(server);
	io.Users = Users;
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

		var userRoom = "user:room:" + socket.handshake.user.username;
		// Помещение подключившегося пользователя в комнату Lobby
		require('./types/start')(socket, userRoom);
		//генерирую событие списка комнат getContsctsList
		// Обработка пользовательских событий
		require('./types/message')(socket);
		require('./types/joinroom')(socket);
		require('./types/contacts')(socket);
		require('./types/disconnect')(socket);
    });

    return io;
};
