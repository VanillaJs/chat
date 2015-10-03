import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import UserInfo from '../user-info';
import UserDetail from '../user-detail';
import ContactSearch from '../contact-search';
import ChannelAdd from '../channel-add';
import ChannelList from '../channel-list';
import {sendAddContact} from '../../actions/channels';
import './sidebar.sass';

@connect(store => ({
	channels: store.channels,
	user: store.user
}))

class Sidebar extends Component {
	static propTypes = {
		dispatch: PropTypes.func,
		channels: PropTypes.object.isRequired
	}

	handleContactSearch(username) {
		this.props.dispatch(sendAddContact(username));
	}

	handleOnlineCount() {
		let count = 0;
		for (const key in this.props.channels.contacts) {
			if (this.props.channels.contacts[key].is_online) {
				count++;
			}
		}
		return count;
	}

	render() {
		const {channels, dispatch} = this.props;
		return (
			<aside className="sidebar">
				<UserInfo user={this.props.user}/>
				<UserDetail contactsCount={Object.keys(this.props.channels.contacts).length} onlineContacts={this.handleOnlineCount()}/>
				<ContactSearch onContactSearch={this.handleContactSearch.bind(this)} />
				<ChannelAdd/>
				<ChannelList channels={channels} dispath={dispatch}/>
			</aside>
		);
	}
}

export default Sidebar;
