import React, {Component, PropTypes} from 'react';
import './index.sass';

class Channel extends Component {
	static propTypes = {
		channel: PropTypes.object,
		changeChannel: PropTypes.func,
	}
	constructor(props) {
		super(props);
	}

	changeChannel() {
		this.props.changeChannel(this.props.channel._id);
	}


	render() {
		console.log(this.props.channel);

		const activeTab = this.props.active ? <div className="channel__active-label"></div> : '';

		return (
			<li className="channel-wrap" onClick={this.changeChannel.bind(this)}>
				<a href="#" className="channel">
					{activeTab}
					<div className="channel__image-wrap"><img src="http://bit.ly/1R3jddn" alt="" className="channel__image"></img></div>
					<div className="channel__message">
						<div className="channel__message-header"><span>{this.props.channel.name}</span></div>
						<div className="channel__message-content"><span>Первое сообщение, приём, т...</span></div>
					</div>
					<div className="channel__time"><span>10:10</span></div>
				</a>
			</li>
		);
	}
}

export default Channel;
