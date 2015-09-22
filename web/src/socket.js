import io from 'socket.io-client';
import {dispatch} from './store';
import {addRemoteMessage} from './actions/messages';
import {setActiveChannel} from './actions/channels';

export const socket = io.connect({transports: ['websocket', 'polling']});

export function bindActionsToSocketEvents() {
	socket.on('s.room.join', data => { dispatch(setActiveChannel(data.room)); });
	socket.on('s.user.send_message', data => { dispatch(addRemoteMessage(data)); });
}

