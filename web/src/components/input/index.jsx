import React, {Component, PropTypes} from 'react';
import './input.sass';

class Input extends Component {
  render() {
    return (
    <div className="dialog-input">
      <div className="userpic userpic--dialog">
        <img className="userpic__image" src="http://bit.ly/1R3jddn" alt="Userpic"></img>
        <span className="user-status user-status--online">Online</span>
      </div>
      <div className="dialog-input__window">
        <textarea className="dialog-input__textarea">Ага, вижу</textarea>
        <a className="dialog-input__add-button" href="#">+</a>
      </div>
      <button className="dialog-input__send-button" type="submit">Send</button>
    </div>
    );
  }
}

export default Input;
