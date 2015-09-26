import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {addMessage} from '../../actions/messages';
import Dialog from '../dialog';
import Input from '../input';
import './main.sass';

@connect(store => ({
	messages: store.messages,
	channels: store.channels
}))

class Main extends Component {
  render() {
		const {dispatch} = this.props;
		const boundActions = bindActionCreators({addMessage}, dispatch);

    return (
	    <main className="main">
	      <Dialog />
	      <Input channel={this.props.channels.current} {...boundActions} />
	    </main>
    );
  }
}

export default Main;
