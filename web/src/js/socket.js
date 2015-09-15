import io from 'socket.io-client';
import * as actions from './actions';

let socket = null;

const app = {
	init: function(dispatch) {
		if (socket) {
			return;
		}
		socket = io.connect({transports: ['websocket', 'polling']});
		app.dispatch = dispatch;
		app.bindActions();
	},

	bindActions: function() {
		socket.on('joinResult', data => { app.dispatch(actions.setRoom(data.room)); });
		socket.on('message', data => { app.dispatch(actions.addMessage({text: data.text})); });
	},

	send: function(event, data) {
		socket.emit(event, data);
	},
};

export default app;
