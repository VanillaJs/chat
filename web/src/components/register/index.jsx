import React, {Component} from 'react';
import serialize from 'form-serialize';
import {sendFormData} from '../../utils/request';
import './index.sass';

class Register extends Component {
	constructor() {
		super();
		this.state = {error: null};
	}

	onSubmit(event) {
		event.preventDefault();
		sendFormData('/register', serialize(this.refs.form.getDOMNode()))
				.then(result => {
					const r = JSON.parse(result);
					if (r.error) {
						this.setState({error: r.error});
					} else {
						this.setState({error: null});
						console.log('success');
						// this.props.history.pushState({}, '/');
					}
				})
				.catch(err => {
					this.setState({error: err});
				});
	}

	renderError() {
		return (
			<div className="register-form__error">{this.state.error}</div>
		);
	}

	render() {
		return (
			<form className="register-form" ref="form" onSubmit={::this.onSubmit} action="." method="POST">
				<div className="register-form__header">Registration</div>
				<div className="register-form__content">
					{this.state.error ? this.renderError() : ''}

					<p className="register-form__field">
						<input type="text" name="username" required />
					</p>
					<p className="register-form__field">
						<input type="email" name="email" required />
					</p>
					<p className="register-form__field">
						<input type="password" name="password" required />
					</p>

					<button className="register-form__submit" type="submit">Create</button>
				</div>
			</form>
		);
	}
}

export default Register;
