import assign from 'object-assign';
import channelActionType from '../constants/channels';
import userActionType from '../constants/user';

export function channels(state = {current:null, contacts:[]}, action) {
	switch (action.type) {
	case channelActionType.SET_ACTIVE_CHANNEL:
		return assign({}, state, {current: action.id});
	case channelActionType.ADD_CHANNEL:
		if(action.contact != null)
		{
			state.contacts.push(action.contact);
			return assign({}, state, {current: state.contacts});
		}
		return state;
	case channelActionType.CHANNEL_REMOVE:
		if(action.is_delete) {
			state.contacts.splice(action.num, 1);
			return assign({}, state, {current: state.contacts});
		}
		return state;
	case userActionType.SET_USER_DATA:
		return assign({}, state, {contacts: [...action.contacts]});
	default:
		return state;
	}
}
