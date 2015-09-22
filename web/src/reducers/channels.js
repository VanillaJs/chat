import assign from 'object-assign';
import channelActionType from '../constants/channels';

export function channels(state = {}, action) {
	switch (action.type) {
	case channelActionType.SET_ACTIVE_CHANNEL:
		return assign({}, state, {current: action.id});
	default:
		return state;
	}
}
