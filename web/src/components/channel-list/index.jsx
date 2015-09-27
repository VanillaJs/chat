import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Channel from '../channel';
import {changeChannel} from '../../actions/channels';
import './index.sass';

@connect(store => ({
	channels: store.channels
}))

class ChannelList extends Component {
	static propTypes = {
		dispatch: PropTypes.func.isRequired,
		channels: PropTypes.object.isRequired
	}

	render() {
		const {channels: {contacts}, dispatch} = this.props;
		const boundActionCreators = bindActionCreators({changeChannel}, dispatch);

		return (
			<ul className="channels__add">
				{Object.keys(contacts).map(key => {
					return (
						<Channel
							key={contacts[key]._id}
							active={contacts[key]._id === this.props.channels.current}
							channel={contacts[key]}
							{...boundActionCreators} />
					);
				})}
			</ul>
		);
	}
}

export default ChannelList;
