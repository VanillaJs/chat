import React, {Component} from 'react';
import {connect} from 'react-redux';
import {changeChannel} from '../../actions/channels';
import {sendAddContact} from '../../actions/contacts';
import ContactAdd from '../ContactAdd';

import './contactlist.sass';

@connect(store => ({
	contacts: store.contacts,
	channels: store.channels,
}))

class ContactList extends Component {
	changeChannel(event) {
		const id = event.target.getAttribute('data-id');
		this.props.dispatch(changeChannel(id));
	}

	handleContactAdd(username) {
		this.props.dispatch(sendAddContact(username));
	}

	render() {
		let {contacts, channels} = this.props;
		return (
			<div className="contactlist">
				<ContactAdd onContactAdd={this.handleContactAdd.bind(this)} />
				{contacts.map((contact, i) => {
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
