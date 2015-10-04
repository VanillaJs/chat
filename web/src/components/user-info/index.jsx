import React, {Component, PropTypes} from 'react';
import UserPic from '../user-pic';
import './userinfo.sass';

class UserInfo extends Component {
	static propTypes = {
		user: PropTypes.object
	}

	constructor(props) {
		super(props);
		this.state = {active: false};
	}

	onMouseOver() {
		this.setState({active: true});
	}

	onMouseOut() {
		this.setState({active: false});
	}

	render() {
		const hoverModificator = this.state.active ? 'fa-spin' : '';
		let userName;
		let userAvatar;
		let userColor;
		if (this.props.user.username !== undefined ) {
			userName = this.props.user.username;
		}
		if (this.props.user.avatar !== undefined ) {
			userAvatar = this.props.user.avatar;
		}
		if (this.props.user.color !== undefined ) {
			userColor = this.props.user.color;
		}
		return (
		<div className="user-info" onMouseOver={::this.onMouseOver} onMouseOut={::this.onMouseOut}>
			<div className="user-info__image">
				<UserPic avatar={userAvatar} color={userColor} />
			</div>
			<p className="user-info__greeting">
				Welcome <span className="user-info__name">{userName}</span>
			</p>
			<div className="user-info__icon-settings">
				<i className={'fa fa-cog ' + hoverModificator}></i>
			</div>
		</div>
		);
	}
}

export default UserInfo;
