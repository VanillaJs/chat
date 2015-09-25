import React, {Component, PropTypes} from 'react';
import './dialog-message.sass';

class DialogMessage extends Component {

  render() {
    return (
      <div className="dialog-window">

        <div className="dialog-message dialog-message--long">
          <div className="userpic userpic--dialog">
            <img className="userpic__image" src="http://bit.ly/1iOTU3J" alt="Userpic"></img>
            <span className="user-status user-status--online">Online</span>
          </div>
          <div className="dialog-message__content">
            <p className="dialog-message__sender">Vladimir Putin</p>
            <p className="dialog-message__text">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Faciendum, sol sicine menandro dixerit recusabo optime defendit illius vocet accedit, dictum finxerat nostro malorum temeritate democritea deseruisse rationibus timentis. Loca graecum primo comparat.</p>
          </div>
          <time className="dialog-message__time">13:10</time>
        </div>

        <div className="dialog-message dialog-message--short">
          <div className="dialog-message__content">
            <p className="dialog-message__text">Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
          </div>
          <time className="dialog-message__time">13:13</time>
        </div>

      </div>
    );
  }
}

export default DialogMessage;
