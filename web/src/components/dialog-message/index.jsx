import React, {Component, PropTypes} from 'react';
import moment from 'moment';
import UserPic from '../user-pic';
import './dialog-message.sass';

class DialogMessage extends Component {
	static propTypes = {
		user: PropTypes.object,
		message: PropTypes.object,
		channels: PropTypes.object,
		short: PropTypes.bool
	}

	renderShort() {
		return (
			<div className="dialog-message__content">
				<p className="dialog-message__text">Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
				<time className="dialog-message__time">13:13</time>
			</div>
		);
	}

	renderFull() {
		const {channels, message, user} = this.props;
		let userName;
		let userColor = '90C3D4';
		let userAvatar = '/img/avatar-1.png';
		let userOnline = true;

		userName = message.userId;
		if ( channels.contacts[message.channelId] !== undefined) {
			if ( user._id.toString() === message.userId.toString() ) {
				userName = user.username;
				userColor = user.color;
				userAvatar = user.avatar;
				userOnline = true;
			} else {
				if (message.channelId.toString() === '1bd3b5a8a7a560e168b3890a') {
					userName = message.userId;
				} else {
					userName = channels.contacts[message.channelId].name;
				}
				userColor = channels.contacts[message.channelId].color;
				userAvatar = channels.contacts[message.channelId].avatar;
				userOnline = channels.contacts[message.channelId].is_online;
			}
		}

		return (
			<div className="dialog-message">
				<UserPic
					online={userOnline}
					avatar={userAvatar}
					color={userColor}/>
				<div className="dialog-message__content">
					<p className="dialog-message__sender">{userName}</p>
					<p className="dialog-message__text">{message.message}</p>
				</div>
					<time className="dialog-message__time">{moment(message.created).format('hh:mm')}</time>
			</div>
		);
	}

	render() {
		const message = this.props.short ? this.renderShort() : this.renderFull();
		const cls = 'dialog-message dialog-message--' + ((this.props.short) ? 'short' : 'long');
		return (
			<li className={cls}>
				{message}
			</li>
		);
	}
}

export default DialogMessage;
