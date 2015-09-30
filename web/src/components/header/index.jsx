import React, {Component} from 'react';
import './index.sass';

class Header extends Component {
	render() {
		return (
			<header className="header">
				<a className="header__logo">Vanilla js</a>
				<a className="header__settings-link" href="#">Settings</a>
			</header>
		);
	}
}

export default Header;
