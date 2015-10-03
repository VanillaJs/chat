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
		const {channels: newChannels} = nextProps;
		if (newChannels.current === channels.current ||
				newChannels.contacts[newChannels.current] && newChannels.contacts[newChannels.current].inited) {
			return;
		}
		fetchChannelMessages(nextProps.channels.current);
	}

	componentDidUpdate() {
		const container = this.refs.container.getDOMNode();
		container.scrollTop = container.scrollHeight;
	}

	render() {
		const {messages, channels, user} = this.props;
		return (
			<div ref="container" className="dialog">
				<DialogDetails/>
				<ul className="messages-container">
					{messages[channels.current] && messages[channels.current].map(_ => {
						return <DialogMessage key={_._id} message={_} user={user} channels={channels} />;
					})}
				</ul>
			</div>
		);
	}
}

export default Dialog;
