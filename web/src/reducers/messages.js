import assign from 'object-assign';
import types from '../constants/messages';
import uniq from 'lodash/array/uniq'; // нужна для выборки только уникальных
const defaultData = {
	Lobby: {
		listMessages: [],
		page: 1
	}
};

function updateChannelMessages(state, channelId, message, userId, reverse = false, page = 1) {

	if (!state[channelId]) {
		state[channelId] = {listMessages: [], page: 1};
	}

	const messageList =  message;

	if (state[channelId].page !== page) {
		state[channelId].page = page;
	}
	let listMessagesArr = [];
	if (reverse) {
		// prepend
		listMessagesArr = messageList.concat(state[channelId].listMessages);
	} else {
		// append
		listMessagesArr = state[channelId].listMessages.concat(messageList);
	}
	state[channelId].listMessages = uniq(listMessagesArr, '_id');

	return state;
}


export function messages(state = defaultData, action) {
	switch (action.type) {

	case types.ADD_MESSAGE:
		return state;

	case types.ADD_REMOTE_MESSAGE:

		if (!action.message) {
			return state;
		}
		const {channelId, message, userId} = action.message;
		return assign({}, updateChannelMessages(state, channelId, action.message, userId));

	case types.PREPEND_MESSAGES:
		return assign({}, updateChannelMessages(state, action.channelId, action.messages, action.userId, action.reverse, action.page));

	default:
		return state;
	}
}
