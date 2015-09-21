import types from '../constants/contacts';
import {socket} from '../socket';

export function setContactList(contacts) {
	return {
		type: types.SET_CONTACT_LIST,
		contacts,
	};
}

export function fetchContactList() {
	return dispatch => {
		socket.emit('c.user.get_contact_list');
		socket.on('s.user.set_contact_list', function handler(contacts) {
			dispatch(setContactList(contacts));
			socket.removeEventListener(handler);
		});
	};
}
