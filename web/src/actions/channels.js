import channelActionType from '../constants/channels';
import {socket} from '../socket';

export function setChannels(list) {
	return {
		type: channelActionType.SET_CHANNELS,
		list
	};
}

export function setActiveChannel(id) {
	return {
		type: channelActionType.SET_ACTIVE_CHANNEL,
		id
	};
}

export function setOnlineChannel(data) {
	let channel = data.channel;
	return {
		type: channelActionType.SET_CHANNEL_ONLINE,
		channel
	};
}

export function setOfflineChannel(data) {
	let channel = data.channel;
	return {
		type: channelActionType.SET_CHANNEL_OFFLINE,
		channel
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
		type: channelActionType.SET_CHANNEL_LIST,
		contacts
	};
}

export function removeFromChannelList(data) {
	return {
		type: channelActionType.CHANNEL_REMOVE,
		id: data.id,
		is_delete: data.is_delete
	};
}

export function addContact(contact) {
	return {
		type: channelActionType.ADD_CHANNEL,
		contact
	};
}

export function deleteChannel(id, num) {
	return ()  => {
		socket.emit('c.channel.delete', {id, num});
	};
}

export function sendAddContact(username) {
	return () => {
		socket.emit('c.channel.add', {username});
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

