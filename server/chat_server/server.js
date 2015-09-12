/**
 * Created by timofey on 09.09.15.
 */
var socketio = require('socket.io');
var io;
var guestNumber = 1;
var nickNames = {};
var namesUsed = [];
var currentRoom = {};

exports.listen = function(server) {
    // Запуск Socket.IO-сервера, чтобы выполняться вместе
    // с существующим HTTP-сервером
     io = socketio.listen(server);
    io.set('log_level', 0);
    // Определение способа обработки каждого пользовательского соединения 
     io.sockets.on('connection', function (socket) {
    guestNumber = assignGuestName(socket, guestNumber,
    // Присваивание подключившемуся пользователю имени guest
    nickNames, namesUsed);
    // Помещение подключившегося пользователя в комнату Lobby
    joinRoom(socket, 'Lobby');
    // Обработка пользовательских сообщений, попыток изменения имени
        // и попыток создания/изменения комнат
    handleMessageBroadcasting(socket, nickNames);
    handleNameChangeAttempts(socket, nickNames, namesUsed);
    handleRoomJoining(socket);
        // Вывод списка занятых комнат по запросу пользователя 
        socket.on('rooms', function() {
            socket.emit('rooms', io.sockets.manager.rooms);
        });
        // Определение логики очистки, выполняемой после выхода 
        // пользователя из чата
        handleClientDisconnection(socket, nickNames, namesUsed);
    });
};

function assignGuestName(socket, guestNumber, nickNames, namesUsed) {
    // Создание нового гостевого имени
    var name = 'Guest' + guestNumber;
    // Связывание гостевого имени с идентификатором клиентского подключения
    nickNames[socket.id] = name;
    // Сообщение пользователю его гостевого имени
    socket.emit('nameResult', {
        success: true,
        name: name
    });
    // Обратите внимание, что гостевое имя уже используется sd
    namesUsed.push(name);
    // Для генерирования гостевых имен применяется счетчик с приращением
    return guestNumber + 1;
};

function joinRoom(socket, room) {
    // Вход пользователя в комнату чата
    socket.join(room);
    // Обнаружение пользователя в данной комнате
    currentRoom[socket.id] = room;
    // Оповещение пользователя о том, что он находится в новой комнате
    socket.emit('joinResult', {room: room});
    // Оповещение других пользователей о появлении нового 
    // пользователя в комнате чата
    socket.broadcast.to(room).emit('message', {
        text: nickNames[socket.id] + ' has joined ' + room + '.'
    });
    // Идентификация других пользователей, находящихся в той же 
// комнате, что и пользователь
    var usersInRoom = io.sockets.clients(room);
// Если другие пользователи присутствуют в данной 
// комнате чата, просуммировать их
    if (usersInRoom.length > 1) {
        var usersInRoomSummary = 'Users currently in ' + room + ': ';
        for (var index in usersInRoom) {
            var userSocketId = usersInRoom[index].id;
            if (userSocketId != socket.id) {
                if (index > 0) {
                    usersInRoomSummary += ', ';
                }
                usersInRoomSummary += nickNames[userSocketId];
            }
        }
        usersInRoomSummary += '.';
        // Вывод отчета о других пользователях, находящихся в комнате
        socket.emit('message', {text: usersInRoomSummary});
    }
}

function handleNameChangeAttempts(socket, nickNames, namesUsed) {
    // Добавление слушателя событий nameAttempt
    socket.on('nameAttempt', function(name) {
        // Не допускаются имена, начинающиеся с Guest
        if (name.indexOf('Guest') == 0) {
            socket.emit('nameResult', {
                success: false,
                message: 'Names cannot begin with "Guest".'
            });
        } else {
            // Если имя не используется, выберите его
            if (namesUsed.indexOf(name) == -1) {
                var previousName = nickNames[socket.id];
                var previousNameIndex = namesUsed.indexOf(previousName);
                namesUsed.push(name);
                nickNames[socket.id] = name;
                // Удаление ранее выбранного имени, которое 
                // освобождается для других клиентов
                delete namesUsed[previousNameIndex];
                socket.emit('nameResult', {
                    success: true,
                    name: name
                });
                socket.broadcast.to(currentRoom[socket.id]).emit('message', {
                    text: previousName + ' is now known as ' + name + '.'
                });
        } else {
            socket.emit('nameResult', {
                // Если имя зарегистрировано, отправка клиенту 
                // сообщения об ошибке
                success: false,
                message: 'That name is already in use.'
            });
        }
    }
});
}

function handleMessageBroadcasting(socket) {
    socket.on('message', function (message) {
        socket.broadcast.to(message.room).emit('message', {
            text: nickNames[socket.id] + ': ' + message.text
        });
    });
}

function handleRoomJoining(socket) {
    socket.on('join', function(room) {
        socket.leave(currentRoom[socket.id]);
        joinRoom(socket, room.newRoom);
    });
}

function handleClientDisconnection(socket) {
    socket.on('disconnect', function() {
        var nameIndex = namesUsed.indexOf(nickNames[socket.id]);
        namesUsed.splice(nameIndex,1);
        delete nickNames[socket.id];
    });
}