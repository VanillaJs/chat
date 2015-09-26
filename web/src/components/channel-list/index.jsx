import React, {Component} from 'react';
import {connect} from 'react-redux';
import Channel from '../channel';
import './index.sass';

@connect(store => ({
	channels: store.channels,
}))

class ChannelList extends Component {
	render() {
		console.log(this.props);
		return (
			<div className="channels__add">
			</div>
		);
	}
}

export default ChannelList;
