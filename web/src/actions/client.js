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

function updateProfile(id, name, avatar) {
	return {
		type: actionTypes.UPDATE_PROFILE,
		id,
		name,
		avatar,

	};
}

export function getContactList(room) {
	return dispatch => {
		socket.on('s.user.set_data', function dispatchList(data) {
			dispatch(setContactList(data.contacts));
			dispatch(updateProfile(data.data._id, data.data.username,data.data.avatar));
			socket.removeEventListener('s.user.set_data', dispatchList);
		});
		socket.emit('contact.get_list', room);
		socket.emit('c.user.get_data', {});
	};
}
