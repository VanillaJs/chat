import React, {Component, PropTypes} from 'react';
import UserPic from '../user-pic';
import './dialog-message.sass';

class DialogMessage extends Component {
	static propTypes = {
		user: PropTypes.object,
		message: PropTypes.string,
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
		return (
			<div className="dialog-message ">
				<UserPic/>
				<div className="dialog-message__content">
					<p className="dialog-message__sender">{this.props.user.username}</p>
					<p className="dialog-message__text">{this.props.message}</p>
			<br/>
					<time className="dialog-message__time">13:10</time>
				</div>
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
