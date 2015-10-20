import React, {Component, PropTypes} from 'react';
import UserPic from '../user-pic';
import './index.sass';

class Channel extends Component {
	static propTypes = {
		channel: PropTypes.object.isRequired,
		changeChannel: PropTypes.func.isRequired,
		active: PropTypes.bool,
		unread: PropTypes.number,
		lastMessage: PropTypes.string,
		current: PropTypes.string
	}
	constructor(props) {
		super(props);
	}

	changeChannel(event) {
		event.preventDefault();
		if (this.props.channel._id !== this.props.current) {
			this.props.changeChannel(this.props.channel._id);
		}
	}

	render() {
		const {channel: {avatar, color, name, is_online: isOnline}, unread, active, lastMessage} = this.props;
		const activeModificator = active ? '--active' : '';

		return (
			<li className={'channel-wrap' + activeModificator} onClick={this.changeChannel.bind(this)}>
				<a className="channel">
					<div className="channel__image-wrap">
						<UserPic
							online={isOnline}
							avatar={avatar}
							color={color}/>
					</div>
					<div className="channel__message">
						<div className="channel__message-header"><span>{name}</span></div>
						{(() => {
							if (lastMessage) {
								return (
									<div className="channel__message-content">
										<span className="channel__message-preview">{lastMessage.substring(0, 60)}</span>
									</div>
								);
							}
							return '';
						})()
						}
					</div>
					{unread && unread > 0 ?
						<span className="channel__message-unread">{unread}</span> : ''}
				</a>
			</li>
		);
	}
}

export default Channel;
