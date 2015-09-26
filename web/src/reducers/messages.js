import types from '../constants/messages';

export function messages(state = [], action) {
	switch (action.type) {
	case types.ADD_MESSAGE:
		console.log(action);
		console.log();
		return [...state, action.data.text];
	case types.ADD_REMOTE_MESSAGE:
		console.log(action);
		return [...state, action.message.message];
	default:
		return state;
	}
}
