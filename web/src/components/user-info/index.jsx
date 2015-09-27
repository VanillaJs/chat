import React, {Component} from 'react';
import UserPic from '../user-pic';
import './userinfo.sass';

class UserInfo extends Component {
	render() {
		return (
		<div className="user-info">
			<UserPic/>
			<p className="user-info__greeting">
				Welcome <span className="user-info__name">Dmitry Medvedev</span>
			</p>
			<div className="user-settings">
				<a className="user-settings__icon" href="#">Settings</a>
			</div>
		</div>
		);
	}
}

export default UserInfo;
