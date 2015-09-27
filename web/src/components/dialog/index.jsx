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
		const {messages, user} = this.props;
		return (
			<div className="dialog">
				<DialogDetails/>
					<ul className="messages-container">
						{Object.keys(messages).map(key => {
							return <DialogMessage key={key} user={user} message={messages[key]}/>;
						})}
					</ul>
			</div>
		);
	}
}

export default Dialog;
