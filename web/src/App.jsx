import React, {Component} from 'react';
import Messenger from './components/Messenger';
import ContactList from './components/ContactList';
import Header from './components/Header';
import './components/page.sass';

export default class App extends Component {
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
