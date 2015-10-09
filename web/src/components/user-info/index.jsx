import React, {Component, PropTypes} from 'react';
import UserPic from '../user-pic';
import './userinfo.sass';

class UserInfo extends Component {
	static propTypes = {
		user: PropTypes.object.isRequired
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

	renderUserpic() {
		const {user: {avatar, color}} = this.props;
		return (
			<div className="user-info__image">
				<UserPic online="true" avatar={avatar} color={color} />
			</div>
		);
	}

	render() {
		const {user: {avatar, username}} = this.props;
		const hoverModificator = this.state.active ? 'fa-spin' : '';

		return (
		<div className="user-info" onMouseOver={::this.onMouseOver} onMouseOut={::this.onMouseOut}>
			{avatar && this.renderUserpic()}
			<p className="user-info__greeting">
				Welcome <span className="user-info__name">{username}</span>
			</p>
			<div className="user-info__icon-settings">
				<i className={'fa fa-cog ' + hoverModificator}></i>
			</div>
		</div>
		);
	}
}

export default UserInfo;
