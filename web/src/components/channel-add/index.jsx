import React, {Component, PropTypes} from 'react';
import cx from 'classnames';
import './index.sass';

class ContactAdd extends Component {
	static propTypes = {
		sendAddContact: PropTypes.func,
		removeError: PropTypes.func,
		ui: PropTypes.object.isRequired
	}

	constructor(props) {
		super(props);
		this.state = {active: false};
	}

	componentDidMount() {
		this.refs.input.getDOMNode().addEventListener('keyup', event => {
			if (this.props.ui.errors.addChannel) {
				this.props.removeError('addChannel');
			}
			if (event.keyCode === 13) {
				this._addContact(event);
			}
			if (event.keyCode === 27) {
				this._toggle(event);
			}
		});
		this.refs.input.getDOMNode().addEventListener('blur', () => {
			this.setState({active: false});
			this.props.removeError('addChannel');
		});
	}

	_addContact(event) {
		event.preventDefault();

		const elm = this.refs.input.getDOMNode();
		if (elm.value.trim() !== '') {
			this.props.sendAddContact(elm.value);
			setTimeout( () =>{
				if (!this.props.ui.errors.addChannel) {
					this._toggle();
					elm.value = '';
				}
			}, 400);
		}
	}

	_toggle() {
		const elm = this.refs.input.getDOMNode();
		if (!this.state.active) {
			setTimeout( () => {
				this.refs.input.getDOMNode().focus();
			}, 200);
			this.setState({active: true});
			this.refs.input.getDOMNode().placeholder = 'Enter username';
			elm.value = '';
		} else {
			this.setState({active: false});
			this.props.removeError('addChannel');
		}
	}

	render() {
		const {ui: {errors: {addChannel}}} = this.props;
		const errorModificator = addChannel ? '--error' : '';

		return (
			<div className={cx({'contacts-add': true, 'contacts-add--active': this.state.active})}>
				<div onClick={::this._toggle} className="contacts-add__button">
					<span className="contacts-add__icon">
						<i className="fa fa-plus-circle"></i>
					</span>
					<p className="contacts-add__text">Add friend or group</p>
				</div>
				<div className="contacts-add__form">
					<input className={'contacts-add__input' + errorModificator} ref="input" type="text" placeholder="Enter username"/>
					<p className={cx({'contacts-add__warning': true, 'hide': !addChannel})}>sorry, contact is not found</p>
				</div>
			</div>
		);
	}
}

export default ContactAdd;
