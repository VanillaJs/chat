export function channels(state = {}, action) {
	switch (action.type) {
	case actionTypes.SET_ROOM:
		return assign({}, {current: action.room});
	default:
		return state;
	}
}
