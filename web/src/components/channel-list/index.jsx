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
		const boundActionCreators = bindActionCreators({changeChannel}, this.props.dispatch);
		return (
			<ul className="channels__add">
				{Object.keys(this.props.channels.contacts).map(key => {
					return (
						<Channel
							key={this.props.channels.contacts[key]._id}
							online={this.props.channels.contacts[key].is_online === true}
							active={this.props.channels.contacts[key]._id === this.props.channels.current}
							channel={this.props.channels.contacts[key]}
							{...boundActionCreators} />
					);
				})}
			</ul>
		);
	}
}

export default ChannelList;
