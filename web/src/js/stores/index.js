import {ADD_MESSAGE} from '../constants';

const defaultMsgList = [{id: 2321312, message: 'dsdasdsa'}];

export function channels(state = [], action) {
	return state;
}

export function messages(state = defaultMsgList, action) {
	switch (action.type) {
	case ADD_MESSAGE:
		return [action.text, ...state];
	default:
		return state;
	}
	return state;
}
