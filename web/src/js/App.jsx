import React, {Component} from 'react';
import Messanger from './components/Messanger';
import ContactList from './components/ContactList';
import './components/page.sass';

export default class App extends Component {
	render() {
		return (
			<div className="application">
				<ContactList />
				<Messanger />
			</div>
		);
	}
}
