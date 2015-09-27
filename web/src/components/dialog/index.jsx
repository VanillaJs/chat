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
		user: PropTypes.object
	}

	render() {
		const {messages, channels} = this.props;
		return (
			<div className="dialog">
				<DialogDetails/>
					<ul className="messages-container">
						{messages.map((message, index) => {
							let user = (message.userId === "me") ? "Я" : channels.contacts[message.channelId].name;
							return <DialogMessage key={index} user={user} message={message.message}/>;
						})}
					</ul>
			</div>
		);
	}
}

export default Dialog;
