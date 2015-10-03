import React, {Component, PropTypes} from 'react';
import DialogDetails from '../dialog-details';
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
		if (newChannels.current === channels.current) {
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

	loadNewMessages() {
		if (this.props.messages[this.props.channels.current] !== undefined) {
			let page = this.props.messages[this.props.channels.current].page;
			++page;
			this.props.fetchChannelMessages(this.props.user._id, this.props.channels.current, page);
		}
	}

	render() {
		const {messages, channels, user} = this.props;
		let isOnline = false;
		if ((channels.contacts[channels.current] !== undefined) && (channels.contacts[channels.current].is_online === true)) {
			isOnline = true;
		}
		return (
			<div ref="container" className="dialog">
				<DialogDetails online={isOnline}/>
				<button onClick={this.loadNewMessages.bind(this)}>LoadMessages</button>
				<ul ref="messageContainer" className="messages-container">
					{messages[channels.current] && messages[channels.current].listMessages.map(_ => {
						return <DialogMessage key={_._id} message={_} user={user} channels={channels} />;
					})}
				</ul>
			</div>
		);
	}
}

export default Dialog;
