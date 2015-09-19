import React, {Component} from 'react';
import {Provider} from 'react-redux';
import {bindActionsToSocketEvents} from './socket';
import store from './store';
import App from './App';

bindActionsToSocketEvents();

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
