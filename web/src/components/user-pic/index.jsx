import React, {Component} from 'react';
import './index.sass';

class UserPic extends Component {



	render() {
		var online;
		if (this.props.online) {
			online = <span className="user-status user-status--online">Online</span>;
		}

		return (
			<div className="userpic">
				<img className="userpic__image" src="http://bit.ly/1R3jddn" alt="Userpic"></img>
				{online}
			</div>
		);
	}
}

export default UserPic;
