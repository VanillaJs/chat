import React, {Component} from 'react';
import './index.sass';

class Channel extends Component {
  constructor(props) {
    super();
    this.state = {active: false};
  }

	changeChannel() {
		this.props.changeChannel(this.props.channel._id);
	}

	showSettings(event) {
		event.preventDefault();
		if (this.state.active) {
			this.setState({active: false});
		} else {
			this.setState({active: true});
		}
	}

	render() {
		const activeTab = this.state.active ? <div className="room__active-label"></div> : '';

		return (
			<li className="channel-wrap" onClick={this.changeChannel.bind(this)}>
				<a href="#" className="channel" onClick={this.showSettings.bind(this)}>
					{activeTab}
					<div className="channel__image-wrap"><img src="http://bit.ly/1R3jddn" alt="" className="channel__image"></img></div>
					<div className="channel__message">
						<div className="channel__message-header"><span>Vladimir Putin</span></div>
						<div className="channel__message-content"><span>Первое сообщение, приём, т...</span></div>
					</div>
					<div className="channel__time"><span>10:10</span></div>
				</a>
			</li>
		);
	}
}

export default Channel;
