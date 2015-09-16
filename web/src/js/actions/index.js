import actionTypes from '../constants';
import socket from '../socket';

export function addSelfMessage(text, room) {
	console.log('self message', text, room)
	socket.send('message', {text, room});

	return {
		type: actionTypes.ADD_SELF_MESSAGE,
		text,
	};
}

export function addRemoteMessage(text) {
	console.log('remote', text);
	return {
		type: actionTypes.ADD_REMOTE_MESSAGE,
		text,
	};
}

export function updateRoomList(rooms) {
	return {
		type: actionTypes.UPDATE_ROOMS,
		rooms,
	};
}

export function setRoom(name) {
	return {
		type: actionTypes.SET_ROOM,
		name,
	};
}

export function setName(name) {
	return {
		type: actionTypes.SET_NAME,
		name,
	};
}
