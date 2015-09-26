import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Channel from '../channel';
import {changeChannel} from '../../actions/channels';
import './index.sass';

@connect(store => ({
	channels: store.channels,
}))

class ChannelList extends Component {
	render() {
		const {channels: {contacts}, dispatch} = this.props;
		const boundActionCreators = bindActionCreators({changeChannel}, dispatch);

		return (
			<ul className="channels__add">
				{Object.keys(contacts).map(key => {
					return <Channel channel={contacts[key]} {...boundActionCreators} />;
				})}
			</ul>
		);
	}
}

export default ChannelList;
