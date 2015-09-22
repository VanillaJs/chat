import contactActionType from '../constants/contacts';
import {socket} from '../socket';

export function setContactList(contacts) {
	return {
		type: contactActionType.SET_CONTACT_LIST,
		contacts,
	};
}

export function addContact(contact) {
	return {
		type: contactActionType.ADD_CONTACT,
		contact,
	};
}

export function sendAddContact(username) {
	return dispatch => {
		socket.emit('c.contact.add', {username});
		socket.on('s.contact.add', function handler(data) {
			dispatch(addContact(data));
			socket.removeEventListener('s.contact.add', handler);
		});
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
