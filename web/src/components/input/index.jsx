import React, {Component, PropTypes} from 'react';
import UserPic from '../user-pic';
import './input.sass';

class Input extends Component {
	static propTypes = {
		addMessage: PropTypes.func,
		channel: PropTypes.string,
		activeChannelId: PropTypes.string,
		user: PropTypes.object
	}

	submitMessage(event) {
		event.preventDefault();
		event.stopPropagation();

		const elm = this.refs.messageInput.getDOMNode();
		const text = elm.value;
		const {addMessage, activeChannelId, user} = this.props;
		if (text) {
			addMessage('text', text, activeChannelId, user._id);
			elm.value = '';
		}
	}

	render() {
		return (
			<div className="dialog-input">
				<UserPic />
				<div className="dialog-input__window">
					<textarea ref="messageInput" className="dialog-input__textarea"></textarea>
					<i className="dialog-input__add-button"></i>
				</div>
				<button onClick={::this.submitMessage} className="dialog-input__send-button" type="submit">Send</button>
			</div>
		);
	}
}

export default Input;
