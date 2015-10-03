import assign from 'object-assign';
import userActionType from '../constants/user';

const defaultUserData = {
	avatar: 'http://lorempixel.com/80/80/'
};

export function user(state = defaultUserData, action) {
	switch (action.type) {
	case userActionType.SET_USER_DATA:
		return assign({}, action.user);
	case userActionType.SET_ID:
		return assign({}, state,  {_id: action.id});

	default:
		return state;
	}
}
