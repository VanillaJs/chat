import assign from 'object-assign';
import types from '../constants/messages';
import uniq from 'lodash/array/uniq'; // нужна для выборки только уникальных
const defaultData = {
	Lobby: {
		listMessages: [],
		page: 1
	}
};

function updateChannelMessages(state, channelId, message, userId, page = 1) {
	if (!state[channelId]) {
		state[channelId] = {listMessages: [], page: 1};
	}

	const messageList = typeof message === 'string' ? [{message, userId, channelId, _id: state[channelId].listMessages.length + 1}] : message;

	if (state[channelId].page !== page) {
		state[channelId].page = page;
	}
	state[channelId].listMessages = uniq(state[channelId].listMessages.concat(messageList), '_id');

	return state;
}


export function messages(state = defaultData, action) {
	switch (action.type) {

	case types.ADD_MESSAGE:
		return assign({}, updateChannelMessages(state, action.data.channelId, action.data.text, action.data.userId));

	case types.ADD_REMOTE_MESSAGE:
		if (!action.message) {
			return state;
		}
		const {channelId, message, userId} = action.message;
		return assign({}, updateChannelMessages(state, channelId, message, userId));

	case types.PREPEND_MESSAGES:
		return assign({}, updateChannelMessages(state, action.channelId, action.messages, action.userId, action.page));

	default:
		return state;
	}
}
