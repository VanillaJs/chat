import React, {Component} from 'react';
import UserPic from '../user-pic';
import './userinfo.sass';

class UserInfo extends Component {

	render() {
		return (
		<div className="user-info">
			<div className="user-info__image">
				<UserPic/>
			</div>
			<p className="user-info__greeting">
				Welcome <span className="user-info__name">Dmitry Medvedev</span>
			</p>
			<div className="user-info__icon-settings">
				<i className="fa fa-cog"></i>
			</div>
		</div>
		);
	}
}

export default UserInfo;
