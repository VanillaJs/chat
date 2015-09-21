import io from 'socket.io-client';
import store from './store';
import * as actions from './actions/server';

export const socket = io.connect({transports: ['websocket', 'polling']});

export function bindActionsToSocketEvents() {
	socket.on('s.room.join', data => { store.dispatch(actions.setRoom(data.room)); });
	socket.on('s.room.message', data => { store.dispatch(actions.addRemoteMessage(data.userId, data.message)); });
}
