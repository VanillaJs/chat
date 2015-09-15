import React, {Component, PropTypes} from 'react';
import './messagebox.sass';

class MessageBox extends Component {
	constructor(props) {
		super(props);
		this.onClick = this.onClick.bind(this);
	}

	onClick() {
		const input = this.refs.input.getDOMNode();
		const text = input.value.trim();
		if (this.props.onMessage && text) {
			this.props.onMessage(text);
			input.value = '';
		}
	}

	render() {
		return (
			<div className="chat-input">
				<div className="chat-input__self-image"></div>
				<textarea ref="input" className="chat-input__text-area"></textarea>
				<button onClick={this.onClick} className="chat-input__send-button" type="submit">Отправить</button>
			</div>
		);
	}
}

MessageBox.propTypes = {
	onMessage: PropTypes.func,
};

export default MessageBox;
