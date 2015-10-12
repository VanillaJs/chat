import React, {Component, PropTypes} from 'react';
import {updateProfile} from '../../actions/user';
import './index.sass';

class UserInfoForm extends Component {
	static propTypes = {
		dispatch: PropTypes.func.isRequired,
		modificator: PropTypes.string,
		user: PropTypes.object.isRequired
	};
	constructor() {
		super();
		this.state = {error: null, user: {}};
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			user: {
				_id: nextProps.user._id,
				username: nextProps.user.username,
				email: nextProps.user.email,
				avatar: nextProps.user.avatar,
				color: nextProps.user.color
			}
		});
	}

	onSubmit(event) {
		event.preventDefault();
		this.props.dispatch(updateProfile(this.state.user));
	}

	handleChange(event) {
		const retObject = this.state;
		retObject.user[event.target.name] = event.target.value;
		this.setState(retObject);
	}

	renderInput(name, value) {
		// ыремени нет разбираться как правильно ((
		let input = <input type="radio" onChange={this.handleChange.bind(this)} name={name} value={value}/>;
		if (this.state.user[name] === value) {
			input = <input type="radio" onChange={this.handleChange.bind(this)} checked name={name} value={value}/>;
		}
		return (
			<span>{input} {value}</span>
		);
	}

	renderError() {
		return (
			<div className="changeinfo-form__error">{this.state.error}</div>
		);
	}

	render() {
		const  colors = ['31b0c3', 'fdc689', 'f8a232', 'f8a232', 'f6a4c9', '8c6239', '39b54a'];
		const avatars = ['/img/avatar-1.png', '/img/avatar-2.png', '/img/avatar-3.png'];
		const userAvatar = [];
		const userColors = [];
		/* eslint guard-for-in: 0 */
		for (const i in avatars) {
			userAvatar.push(this.renderInput('avatar', avatars[i]));
		}
		for (const k in colors) {
			userColors.push(this.renderInput('color', colors[k]));
		}

		return (
			<form className={'changeinfo-form' + this.props.modificator} ref="form" onSubmit={::this.onSubmit} action="." method="POST">
				<div className="changeinfo-form__header">
					<h2>Update profile</h2>
				</div>
				<div className="changeinfo-form__content">
					{this.state.error ? this.renderError() : ''}
					<p className="changeinfo-form__field">
						<label>Username</label>
						<input ref="username" type="text" name="username" onChange={this.handleChange.bind(this)} value={this.state.user.username}/>
					</p>
					<p className="changeinfo-form__field">
						<label>Email</label>
						<input ref="email" type="text" name="email" onChange={this.handleChange.bind(this)} value={this.state.user.email}/>
					</p>
					<p className="changeinfo-form__field">
						<label>Password</label>
						<input ref="password" type="password" name="password" onChange={this.handleChange.bind(this)}/>
					</p>

					<p className="changeinfo-form__field">
						<label>User picture</label>
						{userAvatar}
					</p>
					<p className="changeinfo-form__field">
						<label>User color</label>
						{userColors}
					</p>

					<button className="changeinfo-form__submit" type="submit">Update</button>
				</div>
			</form>
		);
	}
}

export default UserInfoForm;
