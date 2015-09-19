import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {getContactList} from '../../actions/client';

import './contactlist.sass';

@connect(store => ({
	contacts: store.contacts,
	rooms: store.rooms,
}))

class ContactList extends Component {
	componentDidMount() {
		if(this.props.rooms.current) {
			this.fetchContactList();
		}
	}

	componentWillReceiveProps(nextProps, prevProps) {
		if (nextProps.rooms.current !== this.props.rooms.current) {
			this.fetchContactList(nextProps.rooms.current);
		}
	}

	fetchContactList(room) {
		let {dispatch, rooms} = this.props;
		dispatch(getContactList(room));
	}

	render() {
		let {contacts} = this.props;
		return (
			<div className="contactlist">
				{contacts.map((contact, i) => {
					return (
						<div className="contactlist__contact" key={i}>{contact.name}</div>
					);
				})}
			</div>
		);
	}
}

export default ContactList;
