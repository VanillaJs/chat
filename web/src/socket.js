import io from 'socket.io-client';
import {dispatch} from './store';
import {addRemoteMessage} from './actions/messages';

import {setActiveChannel, setOfflineChannel, setOnlineChannel, addContact, removeFromChannelList, setPrivateToChannel} from './actions/channels';
import {setUserId} from './actions/user';
import {setError} from './actions/ui';

let socket;

const transport = {
	bindActionsToSocketEvents: function() {
		const socket = this.socket;
		socket.on('s.user.set_user_id', data => { dispatch(setUserId(data)); });
		socket.on('s.user.send_private', data => { dispatch(setPrivateToChannel(data.channel, data.custom.message_count)); });
		socket.on('s.channel.join', data => { dispatch(setActiveChannel(data.channel)); });
		socket.on('s.channel.online', data => { dispatch(setOnlineChannel(data)); });
		socket.on('s.channel.offline', data => { dispatch(setOfflineChannel(data)); });
		socket.on('s.user.send_message', data => { dispatch(addRemoteMessage(data)); });
		socket.on('s.channel.add', data => {
			if (data !== null) {
				dispatch(addContact(data));
			} else {
				dispatch(setError('addChannel'));
			}
		});
		socket.on('s.channel.delete', data => {
			dispatch(removeFromChannelList(data));
		});
	}
};

export function init() {
	socket = io.connect({transports: ['websocket', 'polling']});
}

export function onSetUser(handler) {
	socket.on('s.user.set_user_id', handler);
}

export function onSendPrivate(handler) {
	socket.on('s.user.send_private', handler);
}

export function onJoin(handler) {
	socket.on('s.user.set_user_id', handler);
}

export function onSetUser(handler) {
	socket.on('s.user.set_user_id', handler);
}


export default transport;
