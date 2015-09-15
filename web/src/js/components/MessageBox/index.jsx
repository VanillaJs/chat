import React, {Component, PropTypes} from 'react';
import './messagebox.sass';

class MessageBox extends Component {
	constructor(props) {
		super(props);
		this.onClick = this.onClick.bind(this);
		this._toggleMode = this._toggleMode.bind(this);
		window.addEventListener('keyup', event => {
			const keyCode = event.keyCode;
			if (keyCode === 13 && event.ctrlKey && this.state.active) {
				this.onClick();
			}
		});
		this.state = {active: false};
	}

	onClick() {
		const input = this.refs.input.getDOMNode();
		const text = input.value.trim();
		if (this.props.onMessage && text) {
			this.props.onMessage(text);
			input.value = '';
		}
	}

	_toggleMode() {
		this.setState({active: !this.state.active});
	}

	render() {
		return (
			<div className="chat-input">
				<div className="chat-input__self-image"></div>
				<textarea ref="input" onFocus={this._toggleMode} onBlur={this._toggleMode} className="chat-input__text-area"></textarea>
				<button onClick={this.onClick} className="chat-input__send-button" type="submit">Отправить</button>
			</div>
		);
	}
}

MessageBox.propTypes = {
	onMessage: PropTypes.func,
};

export default MessageBox;
