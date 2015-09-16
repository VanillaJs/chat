import assign from 'object-assign';
import actionTypes from '../constants';

const defaults = {
	messages: [{id: 2321312, message: 'dsdasdsa'}],
	user: {avatar: 'http://lorempixel.com/80/80/'},
};

export function channels(state = []) {
	return state;
}

export function rooms(state = {}, action) {
	switch (action.type) {
	case actionTypes.SET_ROOM:
		return {current: action.name};
	default:
		return state;
	}
}

export function messages(state = defaults.messages, action) {
	switch (action.type) {
	case actionTypes.ADD_SELF_MESSAGE:
	case actionTypes.ADD_REMOTE_MESSAGE:
		return [...state, action.text];
	default:
		return state;
	}
	return state;
}

export function user(state = defaults.user, action) {
	switch (action.type) {
	case actionTypes.SET_NAME:
		return assign({}, state, {name: action.name});
	default:
		return state;
	}
	return state;
}
