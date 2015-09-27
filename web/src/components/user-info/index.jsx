import React, {Component} from 'react';
import UserPic from '../user-pic';
import './userinfo.sass';

class UserInfo extends Component {

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

		return (
		<div className="user-info" onMouseOver={this.onMouseOver.bind(this)} onMouseOut={this.onMouseOut.bind(this)}>
			<div className="user-info__image">
				<UserPic/>
			</div>
			<p className="user-info__greeting">
				Welcome <span className="user-info__name">Dmitry Medvedev</span>
			</p>
			<div className="user-info__icon-settings">
				<i className={"fa fa-cog " + hoverModificator}></i>
			</div>
		</div>
		);
	}
}

export default UserInfo;
