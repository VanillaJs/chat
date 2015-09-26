import React, {Component, PropTypes} from 'react';
import './header.sass';

class Header extends Component {

  render() {
    return (
      <header className="header">
        <div className="header__logo">
          <img src="" alt="Vanilla Chat"/>
        </div>
          <a className="header__settings-link" href="#">Settings</a>
      </header>
    );
  }
}

export default Header;
