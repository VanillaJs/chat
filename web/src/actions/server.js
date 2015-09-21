import actionTypes from '../constants';

export function addRemoteMessage(userId, message) {
	console.log(message);
	return {
		type: actionTypes.ADD_REMOTE_MESSAGE,
		userId,
		message,
	};
}

export function setRoom(room) {
	return {
		type: actionTypes.SET_ROOM,
		room,
	};
}

export function updateProfile(id, name) {
	return {
		type: actionTypes.UPDATE_PROFILE,
		id,
		name,
	};
}

export function contactTyping(userId) {
	return {
		type: actionTypes.CONTACT_TYPING,
		userId,
	};
}

export function contactJoin(userId, name) {
	return {
		type: actionTypes.CONTACT_JOIN,
		userId,
		name,
	};
}

export function removeContact(userId) {
	return {
		type: actionTypes.CONTACT_REMOVE,
		userId,
	};
}

export function setContactList(users) {
	return {
		type: actionTypes.SET_CONTACT_LIST,
		users,
	};
}
