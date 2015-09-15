var socketio = require('socket.io');
var io;
var guestNumber = 1;
var nickNames = {};
var namesUsed = [];
var currentRoom = {};

exports.listen = function(server) {
	io = socketio.listen(server);
	io.sockets.on('connection', function (socket) {
		guestNumber = assignGuestName(socket, guestNumber, nickNames, namesUsed);
		joinRoom(socket, 'Lobby');
		handleMessageBroadcasting(socket, nickNames);
		socket.on('rooms', function() {
			socket.emit('rooms', io.nsps['/'].adapter.rooms);
		});
	});
}

function assignGuestName(socket, guestNumber, nickNames, namesUsed) {
  var name = 'Guest' + guestNumber;
  nickNames[socket.id] = name;
  socket.emit('nameResult', {
    success: true,
    name: name
  });
  namesUsed.push(name);
  return guestNumber + 1;
};

function joinRoom(socket, room) {
	socket.join(room);
	currentRoom[socket.id] = room;
	socket.emit('joinResult', {room: room});
	socket.broadcast.to(room).emit('message', {
		text: nickNames[socket.id] + ' has joined ' + room + '.'
	});

	var usersInRoom = io.nsps['/'].adapter.rooms[room];
	var ids = Object.keys(usersInRoom);

	if (ids.length > 1) {
		var usersInRoomSummary = 'Users currently in ' + room + ': ';
		for (var id in ids) {
			if (id != socket.id) {
				usersInRoomSummary += ' ' + id;
			}
		}
		usersInRoomSummary += '.';
		socket.emit('users.list', {text: usersInRoomSummary});
	}
}

function handleMessageBroadcasting(socket) {
	socket.on('message', function (message) {
			socket.broadcast.to(message.room).emit('message', {
					text: nickNames[socket.id] + ': ' + message.text
			});
	});
}
