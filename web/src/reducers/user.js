import assign from 'object-assign';
import userActionType from '../constants/user';

export function user(state = {}, action) {
	switch (action.type) {
	case userActionType.SET_USER_DATA:
		return assign({}, action.user);
	case userActionType.SET_ID:
		return assign({}, state, {_id: action.id});

	default:
		return state;
	}
}
