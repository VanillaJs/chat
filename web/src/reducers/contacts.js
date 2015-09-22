import userActionType from '../constants/user';

export function contacts(state = [], action) {
	switch (action.type) {

	case userActionType.SET_USER_DATA:
		return [...action.contacts];

	default:
		return state;
	}
}
