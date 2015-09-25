import React, {Component} from 'react';
import './contactsearch.sass';

class ContactSearch extends Component {
  addContact() {
    const username = this.refs.contactInput.getDOMNode().value;

    if (this.props.onContactSearch && username) {
      this.props.onContactSearch(username);
    }
  }

  render() {
    return (
      <div className="contacts__search">
        <input className="contacts__search-input" ref="contactInput" type="text" />
        <button className="contacts__search-button"  onClick={this.addContact.bind(this)}>Ok</button>
      </div>
    );
  }
}

export default ContactSearch;
