import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {addSelfMessage} from '../../actions';
import MessageBox from '../MessageBox';
import './messanger.sass';

@connect(store => ({
	messages: store.messages,
	rooms: store.rooms,
	user: store.user,
}))

class Messanger extends Component {
	constructor(props) {
		super(props);
		this.onMessage = this.onMessage.bind(this);
	}

	onMessage(text) {
		const {dispatch, rooms} = this.props;
		dispatch(addSelfMessage(text, rooms.current));
	}

	render() {
		let {messages} = this.props;
		return (
			<div className="messanger">
				{messages.map((message, i) => {
					return (
						<div className="messanger__message" key={i}>{message}</div>
					);
				})}
				<MessageBox avatar={this.props.user.avatar} onMessage={this.onMessage} />
			</div>
		);
	}
}

Messanger.propTypes = {
	messages: PropTypes.arrayOf(PropTypes.object),
};

export default Messanger;
