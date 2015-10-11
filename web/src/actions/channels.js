import channelActionType from '../constants/channels';
import {activateVideoPanel} from '../actions/ui';
import transport from '../socket';
import videoStream from '../video-stream';

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

export function setOnlineChannel(data) {
	const channel = data.channel;
	return {
		type: channelActionType.SET_CHANNEL_ONLINE,
		channel
	};
}

export function setOfflineChannel(data) {
	const channel = data.channel;
	return {
		type: channelActionType.SET_CHANNEL_OFFLINE,
		channel
	};
}

export function requestVideoCall(contactId) {
	return dispatch => {
		videoStream
			.requestLocalStream()
			.then(localStream => videoStream.requestRemoteStream(contactId, localStream))
			.then(([localStream, remoteStream]) => {
				dispatch(activateVideoPanel(localStream, remoteStream));
			})
			.catch(error => {
				videoStream.stop();
				console.log(error);
			});
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
		console.log(id);
		transport.socket.emit('c.channel.join', {id});
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
