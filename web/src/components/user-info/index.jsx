import React, {Component, PropTypes} from 'react';
import './userinfo.sass';

class UserInfo extends Component {

  render() {
    return (
    <div className="user-info">
      <div className="userpic">
        <img className="userpic__image" src="http://bit.ly/1R3jddn" alt="Userpic"></img>
        <span className="user-status user-status--online">Online</span>
      </div>
      <p className="user-info__greeting">
        Welcome <span className="user-info__name">Dmitry Medvedev</span>
      </p>
      <div className="user-settings">
        <a className="user-settings__icon" href="#">Settings</a>
      </div>
    </div>
    );
  }
}

export default UserInfo;
