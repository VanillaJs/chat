import assign from 'object-assign';
import types from '../constants/messages';

function updateChannelMessages(state, channelId, message, userId) {
	const messageList = typeof message === 'string' ? [{message, userId, channelId}] : message;
	if (!state[channelId]) {
		state[channelId] = [];
	}
	state[channelId] = state[channelId].concat(messageList);

	return state;
}

export function messages(state = {}, action) {
	switch (action.type) {

	case types.ADD_MESSAGE:
		return assign({}, updateChannelMessages(state, action.data.room_id, action.data.text, action.data.userId));

	case types.ADD_REMOTE_MESSAGE:
		if (!action.message) {
			return state;
		}
		const {channelId, message, userId} = action.message;
		return assign({}, updateChannelMessages(state, channelId, message, userId));

	case types.PREPEND_MESSAGES:
		return assign({}, updateChannelMessages(state, action.channelId, action.messages));

	default:
		return state;
	}
}
