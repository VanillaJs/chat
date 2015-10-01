import React, {Component, PropTypes} from 'react';
import UserPic from '../user-pic';
import './index.sass';

class Channel extends Component {
	static propTypes = {
		channel: PropTypes.object.isRequired,
		changeChannel: PropTypes.func.isRequired,
		active: PropTypes.bool
	}
	constructor(props) {
		super(props);
	}

	changeChannel(e) {
		e.preventDefault();
		this.props.changeChannel(this.props.channel._id);
	}

	render() {
		const activeModificator = this.props.active ? '--active' : '';
		return (
			<li className={'channel-wrap' + activeModificator} onClick={this.changeChannel.bind(this)}>
				<a className="channel">
					<div className="channel__image-wrap">
						<UserPic online={this.props.online}/>
					</div>
					<div className="channel__message">
						<div className="channel__message-header"><span>{this.props.channel.name}</span></div>
						<div className="channel__message-content"><span>Первое сообщение,т...</span></div>
					</div>
					<div className="channel__time"><span>10:10</span></div>
				</a>
			</li>
		);
	}
}

export default Channel;
