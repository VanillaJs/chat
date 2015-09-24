import io from 'socket.io-client';
import {dispatch} from './store';
import {addRemoteMessage} from './actions/messages';
import {setActiveChannel} from './actions/channels';

export const socket = io.connect({transports: ['websocket', 'polling']});

export function bindActionsToSocketEvents() {
	socket.on('s.channel.join', data => { dispatch(setActiveChannel(data.channel)); });
	socket.on('s.user.send_message', data => { dispatch(addRemoteMessage(data)); });
}

