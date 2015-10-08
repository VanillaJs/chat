import assign from 'object-assign';
import channelActionType from '../constants/channels';
import userActionType from '../constants/user';
import messageActionType from '../constants/messages';
const defaultChannelsData = {
	current: null,
	contacts: {
		Lobby: {
			_id: 'Lobby',
			avatar: '/img/avatar-1.png',
			color: '90C3D4',
			inited: true,
			is_online: true,
			message_count: 0,
			name: 'GLOBAL ROOM',
			type: 'room',
			user: 'Lobby'
		}
	}
};

export function channels(state = defaultChannelsData, action) {
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
		action.contacts['Lobby'] = defaultChannelsData.contacts.Lobby; /* eslint dot-notation: 1 */
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

	case messageActionType.ADD_MESSAGE:
	case messageActionType.ADD_REMOTE_MESSAGE:
		const messageData = action.data || action.message;
		if (!messageData) {
			return state;
		}
		const {channelId, text, message} = messageData;
		state.contacts[channelId].lastMessage = text || message;
		return assign({}, state);

	default:
		return state;
	}
}
