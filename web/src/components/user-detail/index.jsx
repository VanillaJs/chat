import React, {Component, PropTypes} from 'react';
import './userdetail.sass';

class UserDetail extends Component {
	static propTypes = {
		contactsCount: PropTypes.number,
		onlineContacts: PropTypes.number
	}
	constructor(props) {
		super(props);
	}

	render() {
		return (
		<div className="user-detail">
			<p className="user-detail__item"><span className="user-detail__number user-detail__number-contacts">{this.props.contactsCount}</span> contacts</p>
			<p className="user-detail__item"><span className="user-detail__number user-detail__number-groups">0</span> groups</p>
			<p className="user-detail__item"><span className="user-detail__number user-detail__number-online">{this.props.onlineContacts}</span> online</p>
			<p className="user-detail__item"><span className="user-detail__number user-detail__number-unread">31</span> unread</p>
			<div className="user-detail__item user-detail__menu"><i className="fa fa-angle-down"></i></div>
		</div>
		);
	}
}

export default UserDetail;
