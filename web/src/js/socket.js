import io from 'socket.io-client';
import store from './store';
import * as actions from './actions/server';

export const socket = io.connect({transports: ['websocket', 'polling']});

export function bindActionsToSocketEvents() {
	socket.on('room.message', data => { store.dispatch(actions.addRemoteMessage(data.userId, data.message)); });
	socket.on('room.join', data => { store.dispatch(actions.setRoom(data.room)); });
	socket.on('user.record', data => { store.dispatch(actions.updateProfile(data.id, data.name)); });
	socket.on('contact.typing', data => { store.dispatch(actions.contactTyping(data.id)); });
	socket.on('contact.join', data => { store.dispatch(actions.contactJoin(data.id, data.name)); });
}
