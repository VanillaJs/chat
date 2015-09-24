import assign from 'object-assign';
import channelActionType from '../constants/channels';
import userActionType from '../constants/user';

export function channels(state = {current:null, contacts:[]}, action) {
	switch (action.type) {
	case channelActionType.SET_ACTIVE_CHANNEL:
		return assign({}, state, {current: action.id});
	case userActionType.SET_USER_DATA:
		return assign({}, state, {contacts: [...action.contacts]});
	default:
		return state;
	}
}
