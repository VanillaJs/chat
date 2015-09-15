import io from 'socket.io-client';
import React, {Component} from 'react';
import {createStore, combineReducers} from 'redux';
import {Provider} from 'react-redux';
import * as reducers from './stores';
import Messanger from './components/Messanger';

const socket = io.connect({transports: ['websocket', 'polling']});
const app = combineReducers(reducers);
const store = createStore(app);

socket.on('joinResult', function onConnection(data) {
	console.log(data);
});

// socket.on('connect_error', function onConnection(data) {
// 	console.log(data);
// });

class App extends Component {
	render() {
		return (
			<Provider store={store}>
				{ () => <Messanger />}
			</Provider>
		);
	}
}

React.render(
	<App />,
	document.getElementById('app'));
