function divEscapedContentElement(message) {
    return $('<li class="message"></li>').text(message);
}
function divSystemContentElement(message) {
    return $('<li class="systemMessage"></li>').html('<i>' + message + '</i>');
}


function processUserInput(chatApp, socket) {
  var message = $('.chat-input__textarea').val();
    var systemMessage;
    // Начинающиеся со слеша данные, вводимые пользователем,
    // трактуются как команды
    if (message.charAt(0) == '/') {
        systemMessage = chatApp.processCommand(message);
        if (systemMessage) {
            $('.chat-window__messages').append(divSystemContentElement(systemMessage));
        }
    } else {
        // Трансляция вводимых пользователем данных другим пользователям
        chatApp.sendMessage($('.rooms__item').text(), message);
        $('.chat-window__messages').append(divEscapedContentElement(message));
        $('.chat-window__messages').scrollTop($('#messages').prop('scrollHeight'));
    }
    $('.chat-input__textarea').val('');
}

var socket = io.connect();

$(document).ready(function() {
    var chatApp = new Chat(socket);

// Вывод результатов попытки изменения имени
    socket.on('nameResult', function(result) {
        var message;

        if (result.success) {
            message = 'You are now known as ' + result.name + '.';
        } else {
            message = result.message;
        }
        $('.chat-window__messages').append(divSystemContentElement(message));
    });

// Вывод результатов изменения комнаты
    socket.on('joinResult', function(result) {
        $('.rooms__item').text(result.room);
        $('.chat-window__messages').append(divSystemContentElement('Room changed.'));
    });
    // Вывод полученных сообщений
    socket.on('message', function (message) {
        var newElement = $('<li></li>').text(message.text);
        $('.chat-window__messages').append(newElement);
    });

// Вывод списка доступных комнат
    socket.on('rooms', function(rooms) {
        $('.rooms__list').empty();
        for(var room in rooms) {
            room = room.substring(1, room.length);
            if (room != '') {
                $('.rooms__list').append(divEscapedContentElement(room));
            }
        }

        // Разрешено щелкнуть на имени комнаты, чтобы изменить ее
        $('.rooms__item').click(function() {
            chatApp.processCommand('/join ' + $(this).text());
            $('.chat-input__textarea').focus();
        });
    });

    // Запрос списка поочередно доступных комнат чата
    setInterval(function() {
        socket.emit('rooms');
    }, 1000);
    $('.chat-input__textarea').focus();
    // Отправка сообщений чата с помощью формы
    $('.chat-input__send-btn').on('click', function() {
        processUserInput(chatApp, socket);
        return false;
    });
});
