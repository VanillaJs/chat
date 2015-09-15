import {ADD_MESSAGE, UPDATE_ROOMS} from '../constants';
import socket from '../socket';

export function addMessage({text, room}, send = false) {
	if (send) {
		socket.send('message', {text, room});
	}

	return {
		type: ADD_MESSAGE,
		text,
	};
}

export function updateRoomList(rooms) {
	return {
		type: UPDATE_ROOMS,
		rooms,
	};
}

export function setRoom(name) {
	return {
		type: 'SET_ROOM',
		name,
	};
}
