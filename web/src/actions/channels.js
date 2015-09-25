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
		socket.emit('c.channel.join', {id});
	};
}

export function setContactList(contacts) {
	return {
		type: contactActionType.SET_CHANNEL_LIST,
		contacts,
	};
}

export function addContact(contact) {
	return {
		type: contactActionType.ADD_CHANNEL,
		contact,
	};
}

export function sendAddContact(username) {
	return dispatch => {
		socket.emit('c.channel.add', {username});
		socket.on('s.channel.add', function handler(data) {
			dispatch(addContact(data));
			socket.removeEventListener('s.channel.add', handler);
		});
	};
}

export function fetchContactList() {
	return dispatch => {
		socket.emit('c.user.get_contact_list');
		socket.on('s.user.SET_CHANNEL_LIST', function handler(contacts) {
			dispatch(setContactList(contacts));
			socket.removeEventListener(handler);
		});
	};
}
