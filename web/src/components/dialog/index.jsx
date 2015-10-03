import React, {Component, PropTypes} from 'react';
import DialogMessage from '../dialog-message';
import './dialog.sass';

class Dialog extends Component {
	static propTypes = {
		messages: PropTypes.object,
		user: PropTypes.object,
		channels: PropTypes.object,
		fetchChannelMessages: PropTypes.func
	}

	/**
	 * Fetch from server message history for active channel
	 * Only once per channel
	 */
	componentWillReceiveProps(nextProps) {
		const {fetchChannelMessages, channels} = this.props;
		const {channels: newChannels, user} = nextProps;
		if (newChannels.current === channels.current ||
				newChannels.contacts[newChannels.current] && newChannels.contacts[newChannels.current].inited) {
			return;
		}
		fetchChannelMessages(user._id, nextProps.channels.current);
	}

	componentWillUpdate() {
		const node = this.refs.container.getDOMNode();
		this.shouldScrollBottom = node.scrollTop + node.offsetHeight === node.scrollHeight;
	}

	componentDidUpdate() {
		if (this.shouldScrollBottom) {
			const node = this.refs.messageContainer.getDOMNode();
			node.scrollTop = node.scrollHeight;
		}
	}


	render() {
		const {messages, channels, user} = this.props;
		return (
			<div ref="container" className="dialog">
				<button onClick={}>LoadMessages</button>
				<ul ref="messageContainer" className="messages-container">
					{messages[channels.current] && messages[channels.current].map(_ => {
						return <DialogMessage key={_._id} message={_} user={user} channels={channels} />;
					})}
				</ul>
			</div>
		);
	}
}

export default Dialog;
