import React, {Component} from 'react';
import {connect} from 'react-redux';
import {changeChannel,deleteChannel,sendAddContact} from '../../actions/channels';
import ContactSearch from '../contact-search';

import './contactlist.sass';

@connect(store => ({
	channels: store.channels,
}))

class ContactList extends Component {
	changeChannel(event) {
		const id = event.target.getAttribute('data-id');
		this.props.dispatch(changeChannel(id));
	}

	deleteChannel(event) {
		const id = event.target.getAttribute('data-id');
		const num = event.target.getAttribute('data-num');
		this.props.dispatch(deleteChannel(id, num));
	}

	handleContactAdd(username) {
		this.props.dispatch(sendAddContact(username));
	}

	render() {
		let {channels} = this.props;
		return (
			<div className="contactlist">
				<ContactAdd onContactAdd={this.handleContactAdd.bind(this)} />
				{Object.keys(channels.contacts).map((key, i) => {
					const cls = `contactlist__contact ${channels.contacts[key]._id === channels.current ? 'is-active' : ''}`;

					return (
						<div className={cls}>
							<div data-id={channels.contacts[key]._id} onClick={this.changeChannel.bind(this)} key={i}>
								{channels.contacts[key].name}
							</div>
							<span data-id={channels.contacts[key]._id} data-num={i} onClick={this.deleteChannel.bind(this)}>x(del)</span>
						</div>
					);
				})}
			</div>
		);
	}
}

export default ContactList;