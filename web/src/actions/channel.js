import actionTypes from '../constants/channel';
import {socket} from '../socket';

export function setChannels(list) {
	return {
		type: actionTypes.SET_CHANNELS,
		list,
	};
}

export function setActiveChannel(list) {
	return {
		type: actionTypes.SET_ACTIVE_CHANNEL,
		list,
	};
}

export function fetchChannelList() {
	return dispatch => {
		socket.emit('c.user.get_channels');
		socket.on('s.user.set_channels', function handler(userData) {
			dispatch(setChannels(userData));
			socket.removeEventListener(handler);
		});
	};
}

export function changeChannel(id) {
	return dispatch => {
		socket.emit('c.room.join', id);
		socket.on('s.room.join', function handler() {
			dispatch(setActiveChannel());
		});
	};
}
