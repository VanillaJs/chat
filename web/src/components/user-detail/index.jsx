import React, {Component} from 'react';
import './userdetail.sass';

class UserDetail extends Component {
	render() {
		return (
		<div className="user-detail">
			<p className="user-detail__item"><span className="user-detail__number user-detail__number-contacts">28</span> contacts</p>
			<p className="user-detail__item"><span className="user-detail__number user-detail__number-groups">1</span> groups</p>
			<p className="user-detail__item"><span className="user-detail__number user-detail__number-online">5</span> online</p>
			<p className="user-detail__item"><span className="user-detail__number user-detail__number-unread">31</span> unread</p>
			<div className="user-detail__item"><a className="user-detail__menu-link" href="#">Меню</a></div>
		</div>
		);
	}
}

export default UserDetail;
