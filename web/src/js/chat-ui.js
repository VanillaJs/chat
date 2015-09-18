function divEscapedContentElement(messageText) {
    // return $('<div class="message__text"></div>').text(messageText);
    return $('<li class="message">').append(($('<div class="message__content">')).append($('<div class="message__text"></div>').text(messageText)));
}
function divSystemContentElement(messageText) {
    return $('<li class="systemMessage"></li>').html('<i>' + messageText + '</i>');
}


function processUserInput(chatApp, socket) {
  var messageText = $('.chat-input__textarea').val();
      // newChatMessage = $('<li/>').attr('class', 'message').append($('<div/>').attr('class', 'message__content').append(divEscapedContentElement(messageText));


    var systemMessage;
    // Начинающиеся со слеша данные, вводимые пользователем,
    // трактуются как команды
    if (messageText.charAt(0) == '/') {
        systemMessage = chatApp.processCommand(messageText);
        if (systemMessage) {
            $('.chat-window__messages').append(divSystemContentElement(systemMessage));
        }
    } else {
        // Трансляция вводимых пользователем данных другим пользователям
        chatApp.sendMessage($('.rooms__item').text(), messageText);
        $('.chat-window__messages').append(divEscapedContentElement(messageText));
        $('.chat-window__messages').scrollTop($('#messages').prop('scrollHeight'));
    }
    $('.chat-input__textarea').val('');
}

var socket = io.connect();

$(document).ready(function() {
    var chatApp = new Chat(socket);

// Вывод результатов попытки изменения имени
    socket.on('nameResult', function(result) {
        var messageText;

        if (result.success) {
            messageText = 'You are now known as ' + result.name + '.';
        } else {
            messageText = result.messageText;
        }
        $('.chat-window__messages').append(divSystemContentElement(messageText));
    });

// Вывод результатов изменения комнаты
    socket.on('joinResult', function(result) {
        $('.rooms__item').text(result.room);
        $('.chat-window__messages').append(divSystemContentElement('Room changed.'));
    });
    // Вывод полученных сообщений
    socket.on('message', function (messageText) {
        var newElement = $('<li></li>').text(messageText.text);
        $('.chat-window__messages').append(newElement);
    });

// Вывод списка доступных комнат
    socket.on('rooms', function(rooms) {
        $('.rooms__list').empty();
        for(var room in rooms) {
            room = room.substring(1, room.length);
            if (room != '') {
                $('.rooms__list').append($('<div/>').text(room));
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
