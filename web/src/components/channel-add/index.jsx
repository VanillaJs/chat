import React, {Component} from 'react';
import './channeladd.sass';

class ContactAdd extends Component {
	render() {
		return (
			<div className="contacts__add">
				<a className="contacts__add-icon" href="#">
					<i className="fa fa-plus-circle"></i>
				</a>
				<p className="contacts__add-text">Add friend or group</p>
			</div>
		);
	}
}

export default ContactAdd;
