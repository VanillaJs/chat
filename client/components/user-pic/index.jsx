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
		let online;
		const {avatar, color} = this.props;
		if (this.props.online) {
			online = <span className="user-status user-status--online">Online</span>;
		}

		return (
			<div className="userpic">
				<img className="userpic__image" src={avatar} style={{backgroundColor: `#${color}`}} height="50" alt=""></img>
				{online}
			</div>
		);
	}
}

export default UserPic;

