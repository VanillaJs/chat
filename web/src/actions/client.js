import actionTypes from '../constants';
import {socket} from '../socket';

export function addSelfMessage(type, message, room) {
	socket.emit('c.user.send_message', {message_type: type, text: message, room_id: room});

	return {
		type: actionTypes.ADD_SELF_MESSAGE,
		message,
	};
}

function setContactList(users) {
	return {
		type: actionTypes.SET_CONTACT_LIST,
		users,
	};
}

export function getContactList(room) {
	return dispatch => {
		socket.on('contact.list', function dispatchList(users) {
			dispatch(setContactList(users));
			socket.removeEventListener('contact.list', dispatchList);
		});
		socket.emit('contact.get_list', room);
		socket.emit('c.user.get_data', {});
	};
}
