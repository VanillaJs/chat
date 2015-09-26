import React, {Component, PropTypes} from 'react';
import UserPic from '../user-pic';
import './input.sass';

class Input extends Component {
  render() {
    return (
    <div className="dialog-input">
      <UserPic/>
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
