import assign from 'object-assign';
import userActionType from '../constants/user';

const defaultUserData = {
	avatar: 'http://lorempixel.com/80/80/'
};

export function user(state = defaultUserData, action) {
	switch (action.type) {
	case userActionType.SET_USER_DATA:
	case userActionType.UPDATE_USER_DATA:
		return assign({}, state, action.user);
	case userActionType.SET_EDITABLE:
		return assign(state, {edit: action.val});
	case userActionType.SET_ID:
		return assign({}, state, {_id: action.id});

	default:
		return state;
	}
}
