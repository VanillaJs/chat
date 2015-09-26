import React, {Component} from 'react';
import UserInfo from '../user-info';
import UserDetail from '../user-detail';
import ContactSearch from '../contact-search';
import ChannelAdd from '../channel-add';
import ChannelList from '../channel-list';
import './sidebar.sass';

class Sidebar extends Component {

  handleContactSearch(username) {
    this.props.dispatch(sendAddContact(username));
  }

  render() {
    return (
      <aside className="sidebar">
        <UserInfo/>
        <UserDetail/>
        <ContactSearch onContactSearch={this.handleContactSearch.bind(this)} />
        <ChannelAdd/>
        <ChannelList/>
      </aside>
    );
  }
}

export default Sidebar;
