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

	constructor(props) {
		super(props);
		this.reverseMessage = false;
		this.loadMessagesByButton = true;
	}
	/**
	 * Fetch from server message history for active channel
	 */

	/*
	componentDidMount() {
		const node = this.refs.messageContainer.getDOMNode();
		let currentPosY = node.scrollTop;

		node.addEventListener('scroll', function() {
			if ((node.scrollTop < currentPosY) && (node.scrollTop === 0)) {
			}
			currentPosY = node.scrollTop;
		});
	}
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

			if (this.reverseMessage) {
				node.scrollTop = 0;
				this.reverseMessage = false;
			} else {
				node.scrollTop = node.scrollHeight;
			}
		}
	}

	anotherMessagesExist() {
		if (this.props.messages[this.props.channels.current] !== undefined) {
			return (this.props.messages[this.props.channels.current].listMessages.length < this.props.channels.contacts[this.props.channels.current].total_messages);
		}
		return true;
	}

	loadNewMessages() {
		if (this.props.messages[this.props.channels.current] !== undefined) {
			let page = this.props.messages[this.props.channels.current].page;
			page += 1;
			this.reverseMessage = true;
			if (this.anotherMessagesExist()) {
				this.props.fetchChannelMessages(this.props.user._id, this.props.channels.current, page, true);
			}
		}
	}

	render() {
		const {messages, channels, user} = this.props;
		let isOnline = false;
		const disabled = this.anotherMessagesExist() ? ' messages-container__button--show ' : '';
		if ((channels.contacts[channels.current] !== undefined) && (channels.contacts[channels.current].is_online === true)) {
			isOnline = true;
		}
		let messagesList = [];
		if (messages[channels.current] && messages[channels.current].listMessages.length > 0) {
			messagesList = messages[channels.current].listMessages;
		}
		return (
			<div ref="container" className="dialog">
				<DialogDetails online={isOnline}/>
				<ul ref="messageContainer" className="messages-container">
					<button className={'messages-container__button' + disabled} onClick={this.loadNewMessages.bind(this)}>Load more messages</button>
					{messagesList.map(hash => {
						return <DialogMessage key={hash._id} message={hash} user={user} channels={channels} />;
					})}
				</ul>
			</div>
		);
	}
}

export default Dialog;
