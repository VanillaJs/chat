import channelActionType from '../constants/channels';
import transport from '../socket';

export function setChannels(list) {
	return {
		type: channelActionType.SET_CHANNELS,
		list
	};
}

export function setPrivateToChannel(id, count) {
	return {
		type: channelActionType.ADD_MESSAGE_TO_CHANNEL,
		id,
		count
	};
}

export function setActiveChannel(id) {
	return {
		type: channelActionType.SET_ACTIVE_CHANNEL,
		id
	};
}

export function setOnlineChannel({channel}) {
	return {
		type: channelActionType.SET_CHANNEL_ONLINE,
		channel
	};
}

export function setOfflineChannel({channel}) {
	return {
		type: channelActionType.SET_CHANNEL_OFFLINE,
		channel
	};
}

export function fetchChannelList() {
	return dispatch => {
		transport.socket.emit('c.user.get_channels');
		transport.socket.on('s.user.set_channels', function handler(list) {
			dispatch(setChannels(list));
			transport.socket.removeListener(handler);
		});
	};
}

export function changeChannel(id) {
	return () => {
		transport.socket.emit('c.channel.join', {id});
	};
}

export function setContactList(contacts) {
	return {
		type: channelActionType.SET_CHANNEL_LIST,
		contacts
	};
}

export function removeFromChannelList({id, is_delete}) {
	return {
		type: channelActionType.CHANNEL_REMOVE,
		id,
		is_delete
	};
}

export function addContact(contact) {
	return {
		type: channelActionType.ADD_CHANNEL,
		contact
	};
}

export function deleteChannel(id, num) {
	return () => {
		transport.socket.emit('c.channel.delete', {id, num});
	};
}

export function sendAddContact(username) {
	return () => {
		transport.socket.emit('c.channel.add', {username});
	};
}

export function fetchContactList() {
	return dispatch => {
		transport.socket.emit('c.user.get_contact_list');
		transport.socket.on('s.user.SET_CHANNEL_LIST', function handler(contacts) {
			dispatch(setContactList(contacts));
			transport.socket.removeListener(handler);
		});
	};
}

