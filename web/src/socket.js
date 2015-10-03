import io from 'socket.io-client';
import {dispatch} from './store';
import {addRemoteMessage} from './actions/messages';

import {setActiveChannel, setOfflineChannel, setOnlineChannel, addContact, removeFromChannelList, setPrivateToChannel} from './actions/channels';
import {setUserId} from './actions/user';

export const socket = io.connect({transports: ['websocket', 'polling']});

export function bindActionsToSocketEvents() {
	socket.on('s.user.set_user_id', data => { dispatch(setUserId(data)); });
	socket.on('s.channel.join', data => { dispatch(setActiveChannel(data.channel)); });
	socket.on('s.user.send_private', data => { dispatch(setPrivateToChannel(data.channel, data.custom.message_count))});
	socket.on('s.channel.online', data => { dispatch(setOnlineChannel(data)); });
	socket.on('s.channel.offline', data => { dispatch(setOfflineChannel(data)); });
	socket.on('s.user.send_message', data => { dispatch(addRemoteMessage(data)); });
	socket.on('s.channel.add', data => {
		dispatch(addContact(data));
	});
	socket.on('s.channel.delete', data => {
		dispatch(removeFromChannelList(data));
	});
}

