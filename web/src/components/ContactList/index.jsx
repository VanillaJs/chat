import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {changeChannel} from '../../actions/channel';

import './contactlist.sass';

@connect(store => ({
	contacts: store.contacts,
	rooms: store.rooms,
}))

class ContactList extends Component {
	changeChannel(event) {
		const id = event.target.getAttribute('data-id');
		this.props.dispatch(changeChannel(id));
	}

	render() {
		let {contacts} = this.props;
		return (
			<div className="contactlist">
				{contacts.map((contact, i) => {
					return (
						<div data-id={contact.id} onClick={this.changeChannel.bind(this)} className="contactlist__contact" key={i}>
							<img src={contact.avatar} />
							{contact.username}
						</div>
					);
				})}
			</div>
		);
	}
}

export default ContactList;
