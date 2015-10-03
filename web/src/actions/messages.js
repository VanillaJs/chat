import * as messageActionType from '../constants/messages';
import {socket} from '../socket';

export function addMessage(messageType = 'text', text, roomId, userId) {
	const data = {message_type: messageType, room_id: roomId, text, userId};

	socket.emit('c.user.send_message', data);

	return {
		type: messageActionType.ADD_MESSAGE,
		data
	};
}

export function addRemoteMessage({userId, message}) {
	return {
		type: messageActionType.ADD_REMOTE_MESSAGE,
		userId,
		message
	};
}

export function prependChannelMessages(channelId, messages) {
	return {
		type: messageActionType.PREPEND_MESSAGES,
		channelId,
		messages
	};
}

export function fetchChannelMessages(channelId) {
	return dispatch => {
		socket.emit('c.user.get_message_by_room', {room_id: channelId, page: 1});
		socket.on('s.user.message_by_room', function listener(r) {
			dispatch(prependChannelMessages(channelId, r.data));
			socket.removeListener('s.user.message_by_room', listener);
		});
	};
}
