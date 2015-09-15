import socket from './socket';
import React, {Component} from 'react';
import {createStore, combineReducers} from 'redux';
import {Provider} from 'react-redux';
import * as reducers from './stores';
import Messanger from './components/Messanger';

const app = combineReducers(reducers);
const store = createStore(app);
socket.init(store.dispatch);

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
