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
	channels: store.channels
}))

class Sidebar extends Component {
	static propTypes = {
		dispatch: PropTypes.func
	}

	handleContactSearch(username) {
		this.props.dispatch(sendAddContact(username));
	}



	render() {
		const {channels, dispatch} = this.props;

		return (
			<aside className="sidebar">
				<UserInfo/>
				<UserDetail/>
				<ContactSearch onContactSearch={this.handleContactSearch.bind(this)} />
				<ChannelAdd/>
				<ChannelList channels={channels} dispath={dispatch}/>
			</aside>
		);
	}
}

export default Sidebar;
