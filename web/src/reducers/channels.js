import assign from 'object-assign';
import channelActionType from '../constants/channels';
import userActionType from '../constants/user';
import {PREPEND_MESSAGES} from '../constants/messages';

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
		if (state.contacts.hasOwnProperty(action.channel)) {
			state.contacts[action.channel].is_online = true;
			return assign({}, state, {contacts: state.contacts});
		}
		return state;

	case channelActionType.SET_CHANNEL_OFFLINE:
		if (state.contacts.hasOwnProperty(action.channel)) {
			state.contacts[action.channel].is_online = false;
			return assign({}, state, {contacts: state.contacts});
		}
		return state;

	case PREPEND_MESSAGES:
		if (state.contacts[action.channelId]) {
			state.contacts[action.channelId].inited = true;
			return assign({}, state);
		}
		return state;
	case channelActionType.READ_MESSAGES:
		if (state.contacts[action.channelId] && action.readLength > 0) {
			state.contacts[action.channelId].message_count = state.contacts[action.channelId].message_count - action.readLength;
			if (state.contacts[action.channelId].message_count < 0 ) {
				state.contacts[action.channelId].message_count = 0;
			}
			return assign({}, state);
		}
		return state;

	case channelActionType.ADD_MESSAGE_TO_CHANNEL:
		if (action.count > 0 && state.contacts.hasOwnProperty(action.id)) {
			state.contacts[action.id].message_count = state.contacts[action.id].message_count + action.count;
			return assign({}, state);
		}
		return state;
	default:
		return state;
	}
}
