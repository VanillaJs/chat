import React, {Component} from 'react';
import store from './store';
import Header from './components/header';
import Sidebar from './components/sidebar';
import Main from './components/main';
import {fetchUserData} from './actions/user';

import './components/page.sass';

export default class App extends Component {
	componentWillMount() {
		store.dispatch(fetchUserData());
	}

	render() {
		return (
			<div className="chat">
				<Header/>
				<Sidebar/>
				<Main/>
			</div>
		);
	}
}
