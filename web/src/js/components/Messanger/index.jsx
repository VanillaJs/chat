import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {addMessage} from '../../actions/chat';
import MessageBox from '../MessageBox';

@connect(store => ({
	messages: store.messages,
}))

class Messanger extends Component {
	constructor(props) {
		super(props);
		this.onMessage = this.onMessage.bind(this);
	}

	onMessage(text) {
		const {dispatch} = this.props;
		dispatch(addMessage(text));
	}

	render() {
		let {messages} = this.props;
		return (
			<div className="messanger">
				{messages.map(message => {
					return (
						<div key={message.id}>{message}</div>
					);
				})}
				<MessageBox onMessage={this.onMessage} />
			</div>
		);
	}
}

Messanger.propTypes = {
	messages: PropTypes.arrayOf(PropTypes.object),
};

export default Messanger;
