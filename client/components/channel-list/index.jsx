import React, {Component, PropTypes} from 'react';
import Channel from '../channel';
import './index.sass';

class ChannelList extends Component {
	static propTypes = {
		changeChannel: PropTypes.func.isRequired,
		channels: PropTypes.object.isRequired,
		currentChannelId: PropTypes.string
	}

	render() {
		const {changeChannel, channels} = this.props;
		return (
			<section className="channels__wrap">
				<h1 className="channels__title">Contacts</h1>
				<ul className="channels__add">
					{Object.keys(channels).map(key => {
						return (
							<Channel
								key={channels[key]._id}
								online={channels[key].is_online === true}
								active={channels[key]._id === this.props.currentChannelId}
								channel={channels[key]}
								current={this.props.currentChannelId}
								lastMessage={channels[key].lastMessage}
								unread={parseInt(channels[key].message_count, 10)}
								changeChannel={changeChannel} />
						);
					})}
				</ul>
			</section>
		);
	}
}

export default ChannelList;
