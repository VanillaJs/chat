import React, {Component} from 'react';
import {connect} from 'react-redux';
import {changeChannel} from '../../actions/channels';
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

	handleContactSearch(username) {
		this.props.dispatch(sendAddContact(username));
	}

	render() {
		let {channels} = this.props;
		return (
			<div className="contactlist">
				<ContactSearch onContactSearch={this.handleContactSearch.bind(this)} />



				{channels.contacts.map((contact, i) => {
					const cls = `contactlist__contact ${contact._id === channels.current ? 'is-active' : ''}`;

					return (
						<div data-id={contact._id} onClick={this.changeChannel.bind(this)} className={cls} key={i}>
							{contact.name}
						</div>
					);
				})}
			</div>
		);
	}
}

export default ContactList;
