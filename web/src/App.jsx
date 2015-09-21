import React, {Component} from 'react';
import store from './store';
import Messenger from './components/Messenger';
import ContactList from './components/ContactList';
import Header from './components/Header';
import {fetchUserData} from './actions/user';

import './components/page.sass';

export default class App extends Component {
	componentWillMount() {
		store.dispatch(fetchUserData());
	}

	render() {
		return (
      <div className="wrapper">
        <Header/>
        <div className="application">
  				<ContactList />
  				<Messenger />
  			</div>
      </div>
		);
	}
}
