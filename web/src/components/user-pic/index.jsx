import React, {Component, PropTypes} from 'react';
import './index.sass';

class UserPic extends Component {
	static propTypes = {
		online: PropTypes.bool,
		avatar: PropTypes.string,
		color: PropTypes.string
	}
	constructor(props) {
		super(props);
	}

	render() {
		let online, userAvatar, userColor;
		const {avatar, color} = this.props;
		if (this.props.online) {
			online = <span className="user-status user-status--online">Online</span>;
		}
		if (avatar !== undefined && color !== undefined) {
			userAvatar = avatar;
			userColor = '#' + color;
		}

		return (
			<div className="userpic">
				<img className="userpic__image" src={userAvatar} style={{background: userColor}} height="50" alt=""></img>
				{online}
			</div>
		);
	}
}

export default UserPic;

