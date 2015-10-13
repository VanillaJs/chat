import React, {Component, PropTypes} from 'react';
import {updateProfile} from '../../actions/user';
import UserPic from '../user-pic';
import './index.sass';

class UserInfoForm extends Component {
	static propTypes = {
		dispatch: PropTypes.func.isRequired,
		modificator: PropTypes.string,
		user: PropTypes.object.isRequired,
		modifyInfoDisable: PropTypes.func
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
				color: nextProps.user.color,
				edit: nextProps.user.edit
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

	renderInput(name, value, id) {
		// времени нет разбираться как правильно ((
		let input = <input className="changeinfo-form__radio-input" type="radio" onChange={this.handleChange.bind(this)} name={name} value={value} id={id}/>;
		let style;

		if (name === 'avatar') {
			style = {
				background: "url('" + value + "')" + ' 50%',
				backgroundSize: '30px'
			};
		} else {
			style = {
				background: '#' + value
			};
		}
		if (this.state.user[name] === value) {
			input = <input className="changeinfo-form__radio-input" type="radio" onChange={this.handleChange.bind(this)} name={name} value={value} id={id} checked/>;
		}
		return (
			<label className={'changeinfo-form__item-label changeinfo-form__item-label--' + [name]} htmlFor={id}>
				{input}
				<div className={'changeinfo-form__item changeinfo-form__item--' + [name]} style={style}/>
			</label>
		);
	}

	renderError() {
		return (
			<div className="changeinfo-form__error">{this.state.error}</div>
		);
	}

	render() {
		const colors = ['31b0c3', 'fdc689', 'f8a232', 'ee4a23', 'f6a4c9', '8c6239', '39b54a'];
		const avatars = ['/img/avatar-1.png', '/img/avatar-2.png', '/img/avatar-3.png',
										 '/img/avatar-4.png', '/img/avatar-5.png', '/img/avatar-6.png', '/img/avatar-7.png'];
		const userAvatar = [];
		const userColors = [];
		/* eslint guard-for-in: 0 */
		for (let i in avatars) {
			userAvatar.push(this.renderInput('avatar', avatars[i], 'avatar-' + (++i)));
		}
		for (let k in colors) {
			userColors.push(this.renderInput('color', colors[k], 'color-' + (++k)));
		}

		return (
			<div onClick={this.props.modifyInfoDisable} className={'changeinfo-form__background' + this.props.modificator}>
				<form className={'changeinfo-form' + this.props.modificator} ref="form" onSubmit={::this.onSubmit} action="." method="POST">
					{this.state.error ? this.renderError() : ''}
					<span onClick={this.props.modifyInfoDisable} className="changeinfo-form__close">Close</span>
					<UserPic
						avatar={this.props.user.avatar}
						color={this.props.user.color} />
					<div className="changeinfo-form__content">
						<div className="changeinfo-form__field">
							<p className="changeinfo-form__field-title">Profile picture:</p>
							<div className="changeinfo-form__field-item">
								{userAvatar}
							</div>
						</div>
						<div className="changeinfo-form__field">
							<p className="changeinfo-form__field-title">Profile color:</p>
							<div className="changeinfo-form__field-item">
								{userColors}
							</div>
						</div>
						<div className="changeinfo-form__field">
							<p className="changeinfo-form__field-title">Username:</p>
							<div className="changeinfo-form__field-item">
								<input className="changeinfo-form__input" ref="username" type="text" name="username" onChange={this.handleChange.bind(this)} value={this.state.user.username}/>
							</div>
						</div>
						<div className="changeinfo-form__field">
							<p className="changeinfo-form__field-title">Mail:</p>
							<div className="changeinfo-form__field-item">
								<input className="changeinfo-form__input" ref="email" type="text" name="email" onChange={this.handleChange.bind(this)} value={this.state.user.email}/>
							</div>
						</div>
						<div className="changeinfo-form__field">
							<p className="changeinfo-form__field-title">Password:</p>
							<div className="changeinfo-form__field-item">
								<input className="changeinfo-form__input" ref="password" type="password" name="password" onChange={this.handleChange.bind(this)} placeholder="******"/>
							</div>
						</div>

						<button className="changeinfo-form__submit" type="submit">Save</button>
					</div>
				</form>
			</div>
		);
	}
}

export default UserInfoForm;
