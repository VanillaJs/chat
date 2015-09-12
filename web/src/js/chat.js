var Chat = function (socket) {
    this.socket = socket;
};
Chat.prototype.sendMessage = function (room, text) {
    var message = {
        room: room,
        text: text
    };
    this.socket.emit('message', message);
};
Chat.prototype.changeRoom = function (room) {
    this.socket.emit('join', {
        newRoom: room
    });
};

Chat.prototype.processCommand = function (command) {
    var words = command.split(' --');
    var command = words[0]
        // Команда синтаксического разбора, начиная с первого слова
        .substring(1, words[0].length)
        .toLowerCase();
    console.log(command);
    var message = false;

    switch (command) {
        case 'join':
            words.shift();
            var room = words.join(' ');
            // Обработка изменения/создания комнаты чата
            this.changeRoom(room);
            break;

        case 'nick':
            words.shift();
            var name = words.join(' ');
            // Обработка попыток изменения имени пользователя чата
            this.socket.emit('nameAttempt', name);
            break;

        default:
            // Возврат сообщения об ошибке, если команда не распознается
            message = 'Unrecognized command.';
            break;
    }
    return message;
};

