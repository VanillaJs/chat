import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {addMessage} from '../../actions/messages';
import Dialog from '../dialog';
import Input from '../input';
import './main.sass';

@connect(store => ({
	messages: store.messages,
	channels: store.channels,
	user: store.user
}))

class Main extends Component {
	static propTypes = {
		dispatch: PropTypes.func,
		channels: PropTypes.object,
		user: PropTypes.object
	}

	render() {
		const {dispatch, user} = this.props;
		const boundActions = bindActionCreators({addMessage}, dispatch);

		return (
			<main className="main">
				<Dialog />
				<Input user={user} channel={this.props.channels.current} {...boundActions} />
			</main>
		);
	}
}

export default Main;
