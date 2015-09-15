import {ADD_MESSAGE} from '../constants';

const defaultMsgList = [{id: 2321312, message: 'dsdasdsa'}];

export function channels(state = []) {
	return state;
}

export function rooms(state = {}, action) {
	switch (action.type) {
	case 'SET_ROOM':
		return {current: action.name};
	default:
		return state;
	}
}

export function messages(state = defaultMsgList, action) {
	switch (action.type) {
	case ADD_MESSAGE:
		return [...state, action.text];
	default:
		return state;
	}
	return state;
}
