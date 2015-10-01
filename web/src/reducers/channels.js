import assign from 'object-assign';
import channelActionType from '../constants/channels';
import userActionType from '../constants/user';

export function channels(state = {current: null, contacts: {}}, action) {
	switch (action.type) {
	case channelActionType.SET_ACTIVE_CHANNEL:
		return assign({}, state, {current: action.id});
	case channelActionType.ADD_CHANNEL:
		if (action.contact !== null) {
			state.contacts[action.contact.channel] = action.contact.custom;
			return assign({}, state, {contacts: state.contacts});
		}
		return state;
	case channelActionType.CHANNEL_REMOVE:
		if (action.is_delete) {
			delete state.contacts[action.id];
			return assign({}, state, {contacts: state.contacts});
		}
		return state;
	case userActionType.SET_USER_DATA:
		return assign({}, state, {contacts: action.contacts});
	case channelActionType.SET_CHANNEL_ONLINE:
		if(state.contacts.hasOwnProperty(action.channel)) {
			state.contacts[action.channel].is_online = true;
		}
		return assign({}, state, {contacts: state.contacts});
	case channelActionType.SET_CHANNEL_OFFLINE:
		if(state.contacts.hasOwnProperty(action.channel)) {
			state.contacts[action.channel].is_online = false;
		}
		return assign({}, state, {contacts: state.contacts});
	default:
		return state;
	}
}
