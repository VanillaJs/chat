import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import UserInfo from '../user-info';
import UserDetail from '../user-detail';
import ChannelFilter from '../channel-filter';
import ChannelAdd from '../channel-add';
import ChannelList from '../channel-list';
import {sendAddContact} from '../../actions/channels';
import {changeChannel} from '../../actions/channels';
import {toggleEditable} from '../../actions/user';
import UserInfoForm from '../user-info-form';
import './sidebar.sass';

@connect(store => ({
	channels: store.channels,
	user: store.user
}))

class Sidebar extends Component {
	static propTypes = {
		dispatch: PropTypes.func.isRequired,
		channels: PropTypes.object.isRequired,
		user: PropTypes.object.isRequired
	}

	constructor(props) {
		super(props);
		this.state = {filterText: '', editable: false};
	}

	getOnlineCount() {
		const {channels: {contacts}} = this.props;
		return Object.keys(contacts).filter(key => contacts[key].is_online).length;
	}

	modifyInfo() {
		this.state.editable = true;
		this.setState(this.state);
		this.props.dispatch(toggleEditable(true));
	}

	modifyInfoDisable() {
		this.state.editable = false;
		this.setState(this.state);
		this.props.dispatch(toggleEditable(false));
	}

	_onFilterChange(text) {
		const filteredChannels = {};
		const {channels: {contacts}} = this.props;
		Object.keys(contacts)
					.filter(key => contacts[key].name.toLowerCase().indexOf(text.toLowerCase()) !== -1)
					.forEach(key => filteredChannels[key] = contacts[key]);
		this.setState({filteredChannels, filterText: text});
	}

	render() {
		const {channels, dispatch, user} = this.props;
		const formClickModificator = user.edit ? '--active' : '';
		return (
			<aside className="sidebar">
				<div onClick={::this.modifyInfoDisable} className={'wrap-popup__background' + formClickModificator}></div>
				<UserInfoForm dispatch={dispatch} user={user}  modificator={' changeinfo-form' + formClickModificator}/>
				<UserInfo user={user} modifyInfo={::this.modifyInfo}/>
				<UserDetail
					contactsCount={Object.keys(this.props.channels.contacts).length}
					onlineContacts={this.getOnlineCount()} />
				<ChannelAdd {...bindActionCreators({sendAddContact}, dispatch)} />
				<ChannelFilter onTextChange={::this._onFilterChange} />
				<ChannelList
					channels={this.state.filterText ? this.state.filteredChannels : channels.contacts}
					currentChannelId={channels.current}
					{...bindActionCreators({changeChannel}, dispatch)} />
			</aside>
		);
	}
}

export default Sidebar;
