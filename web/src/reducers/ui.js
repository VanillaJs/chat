import assign from 'object-assign';
import uiActionType from '../constants/ui';
const defaultData = {
	errors: {
		addChannel: false
	}
};

export function ui(state = defaultData, action) {
	switch (action.type) {

	case uiActionType.SET_ERROR:
		state.errors[action.errorName] = true;
		console.log(state, action);
		console.log(state.errors);
		return assign({}, state);

	case uiActionType.REMOVE_ERROR:
		state.errors[action.errorName] = false;
		return assign({}, state);

	default:
		return state;
	}
}
