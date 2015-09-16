import React, {Component} from 'react';
import Messanger from './components/Messanger';

export default class App extends Component {
	render() {
		return (
			<div className="application">
				<Messanger />
			</div>
		);
	}
}
