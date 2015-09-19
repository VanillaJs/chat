var socketio = require('socket.io');

var io;
var defaultRoom = 'Lobby';
var idIndex = 1;
var users = {};
var currentRoom = {};

exports.listen = function(server) {
	io = socketio.listen(server);
	io.sockets.on('connection', function (socket) {
		assignUserToRoom(socket);

		joinRoom(socket, defaultRoom);

		handleMessageBroadcasting(socket);

		socket.on('contact.get_list', function(room) {
			sendContactList(socket, room);
		});

		socket.on('rooms.get_list', function() {
			socket.emit('rooms.list', io.nsps['/'].adapter.rooms);
		});

		socket.on('disconnect', function () {
	    socket.broadcast.to(currentRoom[socket.id]).emit('contact.disconnected', users[socket.id].id);
	  });
	});
}

function assignUserToRoom(socket) {
  var userId = idIndex++;
  var userName = 'Guest ' + userId;
  users[socket.id] = {
  	name: userName,
  	id: userId
  };
  socket.emit('user.record', {
    success: true,
    name: userName,
  	id: userId
  });
};

function joinRoom(socket, room) {
	socket.join(room);
	currentRoom[socket.id] = room;
	socket.emit('room.join', {room: room});
	socket.broadcast.to(room).emit('contact.join', {id: users[socket.id].id, name: users[socket.id].name});
}

function sendContactList(socket, room) {
	var usersInRoom = io.nsps['/'].adapter.rooms[room];
	var ids = Object.keys(usersInRoom);

	if (ids.length > 1) {
		var roomUsers = [];
		ids.forEach(function(id) {
			if (id != socket.id) {
				roomUsers.push({id: users[id].id, name: users[id].name});
			}
		});
		socket.emit('contact.list', roomUsers);
	}
}

function handleMessageBroadcasting(socket) {
	socket.on('room.send_message', function (data) {
			socket.broadcast.to(data.room).emit('room.message', {
					userId: users[socket.id].id,
					message: data.message
			});
	});
}
