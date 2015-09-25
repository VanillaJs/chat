import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import UserInfo from '../user-info';
import UserDetail from '../user-detail';
import ContactSearch from '../contact-search';
import ContactAdd from '../contact-add';
import './sidebar.sass';

@connect(store => ({
  channels: store.channels,
}))

class Sidebar extends Component {

  handleContactSearch(username) {
    this.props.dispatch(sendAddContact(username));
  }

  render() {
    let {channels} = this.props;
    return (
      <aside className="sidebar">
        <UserInfo/>
        <UserDetail/>
        <ContactSearch onContactSearch={this.handleContactSearch.bind(this)} />
        <ContactAdd/>
      </aside>
    );
  }
}

export default Sidebar;
