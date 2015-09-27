import React, {Component} from 'react';
import './index.sass';

class UserPic extends Component {
	render() {
		return (
			<div className="userpic">
				<img className="userpic__image" src="http://bit.ly/1R3jddn" alt="Userpic"></img>
				<span className="user-status user-status--online">Online</span>
			</div>
		);
	}
}

export default UserPic;
