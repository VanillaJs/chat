export function messages(state = defaults.messages, action) {
	switch (action.type) {
	case actionTypes.ADD_SELF_MESSAGE:
	case actionTypes.ADD_REMOTE_MESSAGE:
		return [...state, action.message];
	default:
		return state;
	}
}
