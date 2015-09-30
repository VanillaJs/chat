import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import DialogDetails from '../dialog-details';
import DialogMessage from '../dialog-message';
import './dialog.sass';

@connect(store => ({
	messages: store.messages,
	channels: store.channels,
	user: store.user
}))

class Dialog extends Component {
	static propTypes = {
		messages: PropTypes.array,
		user: PropTypes.object,
		channels: PropTypes.object
	}

	render() {
		const {messages, channels} = this.props;
		return (
			<div className="dialog">
				<DialogDetails/>
					<ul className="messages-container">
						{messages.map((message, index) => {
							const userName = (channels.contacts[message.channelId] !== undefined && message.channelId !== 'Lobby') ? channels.contacts[message.channelId].name : message.userId;
							const user = (message.userId === 'me') ? 'Я' : userName;
							return <DialogMessage key={index} user={user} message={message.message}/>;
						})}
					</ul>
			</div>
		);
	}
}

export default Dialog;
