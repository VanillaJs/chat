import types from '../constants/messages';

export function messages(state = [], action) {
	switch (action.type) {
	case types.ADD_MESSAGE:
		return [...state, action.message];
	case types.ADD_REMOTE_MESSAGE:
		return [...state, action.message.text];
	default:
		return state;
	}
}
