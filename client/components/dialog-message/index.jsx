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
		short: PropTypes.bool,
		showDate: PropTypes.bool
	}

	shouldComponentUpdate(nextProps) {
		return this._isUserDataChanged(nextProps);
	}

	_isUserDataChanged(nextProps) {
		const currentData = this._getUserData();
		const nextData = this._getUserData(nextProps);
		return !Object.keys(currentData).every(key => currentData[key] === nextData[key]);
	}

	_getUsername() {
		const {channels: {contacts}, message, user} = this.props;
		if (!contacts[message.channelId] || message.channelId.toString() === defaultChannelId) {
			return message.userId;
		}
		return user._id.toString() === message.userId.toString() ? user.username : contacts[message.channelId].name;
	}

	_normalize(rawData) {
		const object = {};
		const supportKeys = 'avatar,color,is_online'.split(',');
		Object.keys(rawData)
					.filter(key => supportKeys.some(supportKey => supportKey === key))
					.forEach(key => object[key] = rawData[key]);

		return Object.assign({avatar: '/img/avatar-1.png', color: '90C3D4', is_online: true}, object);
	}

	_getUserData(rawData) {
		const {channels: {contacts}, message, user} = rawData || this.props;
		if (!contacts[message.channelId]) {
			return this._normalize({});
		}
		return this._normalize(user._id.toString() === message.userId.toString() ? user : contacts[message.channelId]);
	}

	renderUserPic() {
		const {color, avatar, is_online: online} = this._getUserData();

		return (
			<UserPic
				online={online}
				avatar={avatar}
				color={color} />
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
				<time className="dialog-message__time">{moment(message.created).format('HH:mm')}</time>
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
				<time className="dialog-message__time">{moment(message.created).format('HH:mm')}</time>
			</div>
		);
	}

	render() {
		const {message: {created}} = this.props;
		const cls = 'dialog-message dialog-message--' + ((this.props.short) ? 'short' : 'long');
		const message = this.props.short ? this.renderShort() : this.renderFull();
		return (
			<li className={cls}>
				{this.props.showDate ? <div className="dialog-message__date"><span>{moment(created).format('DD/MM')}</span></div> : ''}
				{message}
			</li>
		);
	}
}

export default DialogMessage;
