import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';
import serialize from 'form-serialize';
import {sendFormData} from '../../utils/request';
import './index.sass';

class Login extends Component {
	static propTypes = {
		history: PropTypes.object
	};

	constructor() {
		super();
		this.state = {error: null};
	}

	onSubmit(event) {
		event.preventDefault();
		sendFormData('/login', serialize(this.refs.form.getDOMNode()))
				.then(result => {
					const r = JSON.parse(result);
					if (r.error) {
						this.setState({error: r.error});
					} else {
						this.setState({error: null});
						this.props.history.pushState({}, '/');
					}
				})
				.catch(err => {
					this.setState({error: err});
				});
	}

	renderError() {
		return (
			<div className="login-form__error">{this.state.error}</div>
		);
	}

	render() {
		return (
			<form className="login-form" ref="form" onSubmit={::this.onSubmit} action="." method="POST">
				<div className="login-form__header">
					<h1>Login</h1>
					<Link to={'/register'}>Register</Link>
				</div>
				<div className="login-form__content">
					{this.state.error ? this.renderError() : ''}

					<p className="login-form__field">
						<label>Username</label>
						<input ref="login" type="text" name="username" />
					</p>
					<p className="login-form__field">
						<label>Password</label>
						<input ref="password" type="password" name="password" />
					</p>
					<p className="login-form__field">
						<a href="/login-fb">Facebook</a>
					</p>

					<button className="login-form__submit" type="submit">Login</button>
				</div>
			</form>
		);
	}
}

export default Login;
