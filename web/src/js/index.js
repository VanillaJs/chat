import socket from './socket';
import React, {Component} from 'react';
import {createStore, combineReducers} from 'redux';
import {Provider} from 'react-redux';
import * as reducers from './stores';
import App from './App';


const app = combineReducers(reducers);
const store = createStore(app);
socket.init(store.dispatch);

class AppWrap extends Component {
	render() {
		return (
			<Provider store={store}>
				{ () => <App />}
			</Provider>
		);
	}
}

React.render(
	<AppWrap />,
	document.getElementById('app'));
