import React, {Component, PropTypes} from 'react';
import cx from 'classnames';
import debounce from 'lodash/function/debounce';
import './contactsearch.sass';

class ChannelFilter extends Component {
	static propTypes = {
		onTextChange: PropTypes.func
	}

	constructor(props) {
		super(props);
		this.state = {isEmpty: true};
	}

	_onTextChange(text) {
		const {onTextChange = () => {}} = this.props;
		onTextChange(text);
	}

	_handleKeyUp() {
		const input = this.refs.input.getDOMNode();
		this._onTextChange(input.value);
		this.setState({isEmpty: !input.value});
	}

	_clearInput() {
		const input = this.refs.input.getDOMNode();
		input.value = '';
		this._onTextChange('');
		this.setState({isEmpty: true});
	}

	render() {
		return (
			<div className={cx({'contacts-filter': true, 'contacts-filter_empty': this.state.isEmpty})}>
				<input
					ref="input"
					onKeyUp={debounce(::this._handleKeyUp, 150)}
					className="contacts-filter__input"
					placeholder="Filter channel by name"
					type="text" />
				<span onClick={::this._clearInput} className="contacts-filter__close">&times;</span>
			</div>
		);
	}
}

export default ChannelFilter;
