import React, {Component, PropTypes} from 'react';
import moment from 'moment';
import {defaultChannelId} from '../../config';
import {markdown} from '../../text-processor/process';
import UserPic from '../user-pic';
import './dialog-message.sass';

class DialogMessage extends Component {
	static propTypes = {
		user: PropTypes.object,
		message: PropTypes.object,
		channels: PropTypes.object,
		short: PropTypes.bool
	}

	_getUsername() {
		const {channels: {contacts}, message, user} = this.props;
		if (!contacts[message.channelId] || message.channelId.toString() === defaultChannelId) {
			return message.userId;
		}
		return user._id.toString() === message.userId.toString() ? user.username : contacts[message.channelId].name;
	}

	renderUserPic() {
		const {channels: {contacts}, message, user} = this.props;
		let [userColor, userAvatar, userOnline] = ['90C3D4', '/img/avatar-1.png', true];

		if ( contacts[message.channelId] !== undefined) {
			const userData = user._id.toString() === message.userId.toString() ? user : contacts[message.channelId];
			userColor = userData.color;
			userAvatar = userData.avatar;
			userOnline = userData.is_online || true;
		}

		return (
			<UserPic
				online={userOnline}
				avatar={userAvatar}
				color={userColor} />
		);
	}

	renderShort() {
		const {message} = this.props;
		const htmlMessage = {
			__html: markdown(message.message)
		};

		return (
			<div className="dialog-message__inner-wrap">
				<div className="dialog-message__content">
					<div
						className="dialog-message__text"
						dangerouslySetInnerHTML={htmlMessage} />
				</div>
				<time className="dialog-message__time">{moment(message.created).format('DD/MM HH:mm')}</time>
			</div>
		);
	}

	renderFull() {
		const {message} = this.props;

		const htmlMessage = {
			__html: markdown(message.message)
		};

		return (
			<div className="dialog-message__inner-wrap">
				{this.renderUserPic()}
				<div className="dialog-message__content">
					<p className="dialog-message__sender">{this._getUsername()}</p>
					<div
						className="dialog-message__text"
						dangerouslySetInnerHTML={htmlMessage} />
				</div>
				<time className="dialog-message__time">{moment(message.created).format('DD/MM HH:mm')}</time>
			</div>
		);
	}

	render() {
		const cls = 'dialog-message dialog-message--' + ((this.props.short) ? 'short' : 'long');
		const message = this.props.short ? this.renderShort() : this.renderFull();
		return (
			<li className={cls}>
				{message}
			</li>
		);
	}
}

export default DialogMessage;
