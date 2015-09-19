function divEscapedContentElement(messageText) {
  // return $('<div class="message__text"></div>').text(messageText);
  return $('<li class="message">').append(($('<div class="message__content">')).append($('<div class="message__text"></div>').text(messageText)));
}

function divSystemContentElement(messageText) {
  return $('<li class="systemMessage"></li>').html('<i>' + messageText + '</i>');
}

function processUserInput(chatApp, socket) {
  var messageText = $('.chat-input__textarea').val(),
      systemMessage;
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
  var chatApp = new Chat(socket),
      sendBtn = $('.chat-input__send-btn'),
      textarea = $('.chat-input__textarea'),
      emoBoard = $('.chat-input__emoticons'),
      emoLogo = $('.chat-input__emoticons-main'),
      emoticon = $('.emoticon');

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

  $(textarea).focus();

  // Отправка сообщений чата с помощью формы
  $(sendBtn).on('click', function() {
    processUserInput(chatApp, socket);
    return false;
  });

  $(textarea).on('keypress', function(event) {
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if(keycode == '13') {
      event.preventDefault();
      processUserInput(chatApp, socket)
    }
  });



  $(emoLogo).on('click', function(event) {
    $(emoBoard).toggleClass('chat-input__emoticons--visible');
  });

  $(emoticon).on('click', function(event) {
    $(textarea).append(this);
  });


});
