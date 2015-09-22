import * as messageActionType from '../constants/messages';
import {socket} from '../socket';

export function addMessage(type = 'text', message, channel) {
	socket.emit('c.user.send_message', {message_type: type, text: message, room_id: channel});

	return {
		type: messageActionType.ADD_MESSAGE,
		message,
	};
}

export function addRemoteMessage({userId, message}) {
	return {
		type: messageActionType.ADD_REMOTE_MESSAGE,
		userId,
		message,
	};
}
