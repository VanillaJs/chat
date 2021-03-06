import * as messageActionType from '../constants/messages';
import * as channelActionType from '../constants/channels.js';
import transport from '../socket';

export function addMessage(messageType = 'text', text, channelId, userId) {
	const data = {message_type: messageType, channelId: channelId, text: text, userId: userId};

	transport.socket.emit('c.user.send_message', data);

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

export function prependChannelMessages(channelId, messages, userId, page, reverse) {
	return {
		type: messageActionType.PREPEND_MESSAGES,
		channelId,
		messages,
		userId,
		page,
		reverse
	};
}

export function setReadMessages(userId, data, channelId) {
	var unreadMessages = [];
	// если сообщени есть
	if (data.length) {
		data.map(function messageHandler(message) {
			if (message.read.indexOf(userId) < 0) {
				unreadMessages.push(message._id);
			}
		});
	}
	// если есть непрочитанные тогда делаем их прочитанными
	if (unreadMessages.length) {
		transport.socket.emit('c.user.read_message', {userId: userId, messages: unreadMessages});
	}
	const readLength = unreadMessages.length;
	return {
		type: channelActionType.READ_MESSAGES,
		channelId,
		readLength
	};
}

export function fetchChannelMessages(userId, channelId, page = 1, reverse = false) {
	return dispatch => {
		if (channelId.toString() === 'Lobby') {
			dispatch(prependChannelMessages(channelId, [], userId, page, reverse));
		} else {
			transport.socket.emit('c.user.get_message_by_room', {channelId: channelId, page: page});

			transport.socket.on('s.user.message_by_room', function listener(res) {
				dispatch(prependChannelMessages(channelId, res.data, userId, page, reverse));

				dispatch(setReadMessages(userId, res.data, channelId));
				transport.socket.removeListener('s.user.message_by_room', listener);
			});
		}
	};
}
