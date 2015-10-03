import * as messageActionType from '../constants/messages';
import {socket} from '../socket';

export function addMessage(messageType = 'text', text, roomId, userId) {
	var data = {message_type: messageType, room_id: roomId, text: text, userId: userId};

	text = '//1231{IMG}http://javascript.ru/forum/images/ca_serenity/misc/logo.gif{IMG}asda {img}http://i71.fastpic.ru/thumb/2015/0916/9e/adf88807c416fc7c7eb1d09f51cafd9e.jpeg{IMG}';
	socket.emit('c.user.get_supported_tags');
	socket.on('s.user.return_supported_tags', function listener(data) {
		console.log(data.tags);
		var tags = data.tags.map(function (tag) {
				return '{' + tag + '}';
			}),
			media = [text];
		tags.forEach(function (tag) {
			media.forEach(function (media) {

			})

		});




		tags.forEach(function (tag) {
			text.toLowerCase().split(tag).filter(function (tData, i) {
				return i % 2 === 1
			}).forEach(function (mediaEl) {
				if (!media[tag]) {
					media[tag] = [];
				}
				media[tag].push(mediaEl);
				text.
			});
		});
		console.log(media);

		socket.emit('c.user.send_message', data);
		socket.removeListener('s.user.return_supported_tags', listener);
	});





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
