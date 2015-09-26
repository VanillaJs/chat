import React, {Component} from 'react';
import './index.sass';

class Channel extends Component {

	changeChannel() {
		this.props.changeChannel(this.props.channel._id);
	}

	render() {
		return (
			<li onClick={this.changeChannel.bind(this)}>
				{this.props.channel.name}
			</li>
		);
	}
}

export default Channel;
