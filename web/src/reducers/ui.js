import assign from 'object-assign';
import uiActionType from '../constants/ui';

const defaultData = {
	errors: {
		addChannel: false
	},
	videoPanel: {
		active: false
	}
};

export function ui(state = defaultData, action) {
	switch (action.type) {

	case uiActionType.SET_ERROR:
		state.errors[action.errorName] = true;
		return assign({}, state);

	case uiActionType.REMOVE_ERROR:
		state.errors[action.errorName] = false;
		return assign({}, state);

	case uiActionType.ACTIVATE_VIDEO_PANEL:
		state.videoPanel.active = true;
		state.videoPanel.localStream = action.localStream;
		state.videoPanel.remoteStream = action.remoteStream;
		return assign({}, state);

	case uiActionType.DEACTIVATE_VIDEO_PANEL:
		state.videoPanel.active = false;
		state.videoPanel.localStream = null;
		state.videoPanel.remoteStream = null;
		return assign({}, state);

	default:
		return state;
	}
}
