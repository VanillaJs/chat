import React, {Component, PropTypes} from 'react';
import TranslateProcessor from '../../TextProcessor/TranslateProcessor';
import './message.sass';

const translator = new TranslateProcessor();

class Message extends Component {
	static propTypes = {
		message: PropTypes.string,
	}

	constructor() {
		super();
		this.state = {translateText: ''};
	}

	translateMessage() {
		translator.setText(this.props.message).process().then(text => {
			this.setState({translateText: text});
		});
	}

	render() {
		const translation = this.state.translateText ?
					<div className="message__translation">{this.state.translateText}</div> : '';

		return (
			<div className="message">
				{this.props.message}
				<span
					className="message__translate-button"
					onClick={this.translateMessage.bind(this)}>
					Translate
				</span>
				{translation}
			</div>
		);
	}
}


export default Message;
