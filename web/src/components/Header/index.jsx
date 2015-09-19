import React, {Component, PropTypes} from 'react';
import './header.sass';


class Header extends Component {

  constructor(props) {
    super();
    this.state = {active: false};
  }

  showSettings(event) {
    event.preventDefault();
    this.setState({active: true});
  }

  render() {
    const dialog = this.state.active ? 
    <div className="header__settings">
      <span>Hello</span>
    </div> 
    : '';

    return (
      <header className="header">
        {dialog}
        <div className="header__logo">
          <img src="" alt="Vanilla Chat"/>
        </div>
        <a className="header__settings-link" href="" onClick={this.showSettings.bind(this)}>Settings</a>
      </header>
    );
  }
}


export default Header;
