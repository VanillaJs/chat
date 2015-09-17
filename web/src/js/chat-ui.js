
function divEscapedContentElement(message) {
    return $('<li class="message"></li>').text(message);
}
function divSystemContentElement(message) {
    return $('<li class="systemMessage"></li>').html('<i>' + message + '</i>');
}


function processUserInput(chatApp, socket) {
  var message = $('.chat-input textarea').val();
    var systemMessage;
    // Начинающиеся со слеша данные, вводимые пользователем,
    // трактуются как команды
    if (message.charAt(0) == '/') {
        systemMessage = chatApp.processCommand(message);
        if (systemMessage) {
            $('.message-list').append(divSystemContentElement(systemMessage));
        }
    } else {
        // Трансляция вводимых пользователем данных другим пользователям
        chatApp.sendMessage($('.chat-room').text(), message);
        $('.message-list').append(divEscapedContentElement(message));
        $('.message-list').scrollTop($('#messages').prop('scrollHeight'));
    }
    $('.chat-input textarea').val('');
}

var socket = io.connect('http://127.0.0.1:3001');

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
        $('.message-list').append(divSystemContentElement(message));
    });

// Вывод результатов изменения комнаты
    socket.on('joinResult', function(result) {
        $('.chat-room').text(result.room);
        $('.message-list').append(divSystemContentElement('Room changed.'));
    });
    // Вывод полученных сообщений
    socket.on('message', function (message) {
        var newElement = $('<div></div>').text(message.text);
        $('.message-list').append(newElement);
    });

// Вывод списка доступных комнат
    socket.on('rooms', function(rooms) {
        $('.room-list').empty();
        for(var room in rooms) {
            room = room.substring(1, room.length);
            if (room != '') {
                $('.room-list').append(divEscapedContentElement(room));
            }
        }

        // Разрешено щелкнуть на имени комнаты, чтобы изменить ее
        $('.room-list div').click(function() {
            chatApp.processCommand('/join ' + $(this).text());
            $('.chat-input textarea').focus();
        });
    });

    // Запрос списка поочередно доступных комнат чата
    setInterval(function() {
        socket.emit('chat-rooms');
    }, 1000);
    $('.chat-input textarea').focus();
    // Отправка сообщений чата с помощью формы
    $('.chat-input__send-button').on('click', function() {
        processUserInput(chatApp, socket);
        return false;
    });
});
