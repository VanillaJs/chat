import React, {Component, PropTypes} from 'react';
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
		}
	}

	_toggle() {
		this.setState({active: !this.state.active});
	}

	render() {
		return (
			<div className="contacts__add">
				<span onClick={::this._toggle} className="contacts__add-icon">
					<i className="fa fa-plus-circle"></i>
				</span>
				<p className="contacts__add-text">Add friend or group</p>
				{(() => {
					if (this.state.active) {
						return (
							<div className="contacts__modal">
								<section className="contacts__form">
									<h1>Добавление контакта</h1>
									<input ref="input" type="text" />
									<button onClick={::this._addContact}>OK</button>
									<span className="close" onClick={::this._toggle}>&times;</span>
								</section>
							</div>
						);
					}
				})()}
			</div>
		);
	}
}

export default ContactAdd;
