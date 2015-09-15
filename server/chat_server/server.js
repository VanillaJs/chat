var socketio = require('socket.io');
var io;
var guestNumber = 1;
var nickNames = {};
var namesUsed = [];
var currentRoom = {};

exports.listen = function(server) {
	io = socketio.listen(server);
	io.sockets.on('connection', function (socket) {
		joinRoom(socket, 'Lobby');
	});
}

function joinRoom(socket, room) {
	socket.join(room);
	currentRoom[socket.id] = room;
	socket.emit('joinResult', {room: room});
	socket.broadcast.to(room).emit('message', {
		text: nickNames[socket.id] + ' has joined ' + room + '.'
	});
	// var usersInRoom = io.sockets.rooms[room];
	// if (usersInRoom.length > 1) {
	// 	var usersInRoomSummary = 'Users currently in ' + room + ': ';
	// 	for (var index in usersInRoom) {
	// 		var userSocketId = usersInRoom[index].id;
	// 		if (userSocketId != socket.id) {
	// 			if (index > 0) {
	// 				usersInRoomSummary += ', ';
	// 			}
	// 			usersInRoomSummary += nickNames[userSocketId];
	// 		}
	// 	}
	// 	usersInRoomSummary += '.';
	// 	socket.emit('message', {text: usersInRoomSummary});
	// }
}
