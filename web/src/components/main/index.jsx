import React, {Component, PropTypes} from 'react';
import Dialog from '../dialog';
import Input from '../input';
import './main.sass';

class Main extends Component {

  render() {
    return (
    <main className="main">
      <Dialog/>
      <Input/>
    </main>
    );
  }
}

export default Main;
