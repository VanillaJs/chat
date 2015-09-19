class Chat {
	constructor(socket) {
		super();
		this.socket = socket;
	}

	sendMessage(room, text) {
		let message = {room, text};
		this.socket.emit('message', message);
	}

	changeRoom(room) {
		this.socket.emit('join', {
			newRoom: room
		});
	}

	processCommand(command) {
		let words = command.split(' --');
		let command = words[0]
			.substring(1, words[0].length)
			.toLowerCase();
		let message = false;

		switch (command) {
			case 'join':
				words.shift();
				let room = words.join(' ');
				this.changeRoom(room);
				break;
			case 'nick':
				words.shift();
				let name = words.join(' ');
				this.socket.emit('nameAttempt', name);
				break;
			default:
				message = 'Unrecognized command.';
		}

		return message;
	}
}
