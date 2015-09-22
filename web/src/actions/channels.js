import channelActionType from '../constants/channels';
import {socket} from '../socket';

export function setChannels(list) {
	return {
		type: channelActionType.SET_CHANNELS,
		list,
	};
}

export function setActiveChannel(id) {
	return {
		type: channelActionType.SET_ACTIVE_CHANNEL,
		id,
	};
}

export function fetchChannelList() {
	return dispatch => {
		socket.emit('c.user.get_channels');
		socket.on('s.user.set_channels', function handler(list) {
			dispatch(setChannels(list));
			socket.removeEventListener(handler);
		});
	};
}

export function changeChannel(id) {
	return () => {
		socket.emit('c.room.join', {id});
	};
}
