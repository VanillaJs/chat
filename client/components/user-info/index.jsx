import React, {Component, PropTypes} from 'react';
import UserPic from '../user-pic';
import './index.sass';

class UserInfo extends Component {
	static propTypes = {
		user: PropTypes.object.isRequired,
		modifyInfo: PropTypes.func.isRequired
	}
	constructor(props) {
		super(props);
		this.state = {active: false};
	}

	onMouseOver() {
		if (!this.state.active) {
			this.setState({active: true});
		}
	}

	onMouseOut() {
		if (this.state.active) {
			this.setState({active: false});
		}
	}

	render() {
		const hoverModificator = this.state.active ? 'fa-spin' : '';
		const {user: {avatar, color, username}} = this.props;
		let userName;
		let userAvatar;
		let userColor;
		let userOnline;

		if (username !== undefined && avatar !== undefined) {
			userName = username;
			userAvatar = avatar;
			userOnline = true;
		}
		if (color !== undefined) {
			userColor = color;
		}

		return (
		<div className="user-info" onClick={this.props.modifyInfo} onMouseOver={::this.onMouseOver} onMouseOut={::this.onMouseOut}>
			<div className="user-info__image">
				<UserPic
					online={userOnline}
					avatar={userAvatar}
					color={userColor}/>
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
