import React, {Component} from 'react';

class ContactAdd extends Component {
	addContact() {
		const username = this.refs.contactInput.getDOMNode().value;

		if (this.props.onContactAdd && username) {
			this.props.onContactAdd(username);
		}
	}

	render() {
		return (
			<div>
				<input ref="contactInput" type="text" />
				<button onClick={this.addContact.bind(this)}>ok</button>
			</div>
		);
	}
}

export default ContactAdd;
