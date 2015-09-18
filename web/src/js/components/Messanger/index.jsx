import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {addSelfMessage} from '../../actions/client';
import MessageBox from '../MessageBox';
import Message from '../Message';
import './messanger.sass';

@connect(store => ({
	messages: store.messages,
	rooms: store.rooms,
	user: store.user,
}))

class Messanger extends Component {
	static propTypes = {
		messages: PropTypes.arrayOf(PropTypes.object),
		user: PropTypes.object,
		rooms: PropTypes.object,
	}

	constructor(props) {
		super(props);
		this.onMessage = this.onMessage.bind(this);
	}

	componentDidUpdate() {
		const container = this.refs.messageContainer.getDOMNode();
		container.scrollTop = container.scrollHeight;
	}

	onMessage(message) {
		const {dispatch, rooms} = this.props;
		dispatch(addSelfMessage(message, rooms.current));
	}

	render() {
		const {messages} = this.props;
		return (
			<div className="messanger">
				<div ref="messageContainer" className="messanger__content">
				{messages.map((message, i) => {
					return (
						<Message key={i} message={message} />
					);
				})}
				</div>
				<MessageBox avatar={this.props.user.avatar} onMessage={this.onMessage} />
			</div>
		);
	}
}

export default Messanger;
