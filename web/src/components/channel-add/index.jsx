import React, {Component, PropTypes} from 'react';
import cx from 'classnames';
import './channeladd.sass';

class ContactAdd extends Component {
	static propTypes = {
		sendAddContact: PropTypes.func
	};

	constructor(props) {
		super(props);
		this.state = {active: false};
	}

	_addContact(event) {
		event.preventDefault();

		const elm = this.refs.input.getDOMNode();
		if (elm.value.trim() !== '') {
			this.props.sendAddContact(elm.value);
			this._toggle();
			elm.value = '';
		}
	}

	_toggle() {
		this.setState({active: !this.state.active});
	}

	render() {
		return (
			<div className={cx({'contacts-add': true, 'is-active': this.state.active})}>
				<div onClick={::this._toggle} className="contacts-add__button">
					<span className="contacts-add__icon">
						<i className="fa fa-plus-circle"></i>
					</span>
					<p className="contacts-add__text">Add friend or group</p>
				</div>
				<div className="contacts-add__form">
					<h6>Добавление контакта</h6>
					<input ref="input" type="text" />
					<button onClick={::this._addContact}>OK</button>
					<span className="close" onClick={::this._toggle}>&times;</span>
				</div>
			</div>
		);
	}
}

export default ContactAdd;
