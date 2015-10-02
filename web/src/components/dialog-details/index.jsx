import React, {Component} from 'react';
import './dialog-details.sass';

class DialogDetails extends Component {
	render() {
		return (
			<div className="dialog-details">
				<div className="dialog-details__contact">
					<p className="dialog-details__name">Vladimir Putin</p>
					<p className="dialog-details__status dialog-details__status--online">online</p>
				</div>
			</div>
		);
	}
}

export default DialogDetails;
