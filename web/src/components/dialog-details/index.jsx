import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import './dialog-details.sass';

@connect(store => ({
	channels: store.channels
}))

class DialogDetails extends Component {
	static propTypes = {
		channels: PropTypes.object.isRequired,
		online: PropTypes.bool
	}
	constructor(props) {
		super(props);
	}

	render() {
		const onlineModificator = this.props.online ? '--online' : '';
		let userName;
		if ((this.props.channels.contacts !== undefined) && (this.props.channels.contacts[this.props.channels.current] !== undefined)) {
			userName = this.props.channels.contacts[this.props.channels.current].name;
		}
		return (
			<div className="dialog-details">
				<div className="dialog-details__contact">
					<p className="dialog-details__name">{userName}</p>
					<p className={'dialog-details__status ' + 'dialog-details__status' + onlineModificator}>{this.props.online ? 'online' : 'offline'}</p>
				</div>
			</div>
		);
	}
}

export default DialogDetails;
