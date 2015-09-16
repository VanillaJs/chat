import io from 'socket.io-client';
import * as actions from './actions';

let socket = null;

const app = {
	init: function init(dispatch) {
		if (socket) {
			return;
		}
		if (!dispatch && typeof dispatch !== 'function') {
			throw new Error(`Socket init wait dispatch function as first argument; sended ${typeof dispatch}`);
		}
		socket = io.connect({transports: ['websocket', 'polling']});
		app.dispatch = dispatch;
		app.bindActions();
	},

	bindActions: function bindActions() {
		socket.on('joinResult', data => { app.dispatch(actions.setRoom(data.room)); });
		socket.on('nameResult', data => { app.dispatch(actions.setName(data.room)); });
		socket.on('message', data => { app.dispatch(actions.addRemoteMessage(data.text)); });
	},

	send: function send(event, data) {
		console.log('socket emit', event, data)
		socket.emit(event, data);
	},
};

export default app;
