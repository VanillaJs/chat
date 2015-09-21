import assign from 'object-assign';
import actionTypes from '../constants';
import defaults from './defaults';

export function rooms(state = {}, action) {
	switch (action.type) {
	case actionTypes.SET_ROOM:
		return assign({}, {current: action.room});
	default:
		return state;
	}
}

export function messages(state = defaults.messages, action) {
	switch (action.type) {
	case actionTypes.ADD_SELF_MESSAGE:
	case actionTypes.ADD_REMOTE_MESSAGE:
		return [...state, action.message];
	default:
		return state;
	}
}

export function user(state = defaults.user, action) {
	switch (action.type) {
	case actionTypes.SET_NAME:
		return assign({}, state, {name: action.name});
	case actionTypes.UPDATE_PROFILE:
		return assign({}, state, {id: action.id, name: action.name, avatar:action.avatar});
	default:
		return state;
	}
}

export function contacts(state = [], action) {
	switch (action.type) {
	case actionTypes.SET_CONTACT_LIST:
		return [...action.users];
	case actionTypes.CONTACT_JOIN:
		return [...state, {id: action.id, name: action.name}];
	case actionTypes.CONTACT_REMOVE:
		return state.filter(contact => action.id !== contact.id);
	default:
		return state;
	}
}
