import types from '../constants/messages';

export function messages(state = [], action) {
	switch (action.type) {
	case types.ADD_MESSAGE:
		return [...state, action.data];
	case types.ADD_REMOTE_MESSAGE:
		if (!action.message) {
			return state;
		}
		return [...state, action.message];
	default:
		return state;
	}
}
