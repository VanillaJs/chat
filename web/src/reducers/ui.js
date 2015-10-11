import assign from 'object-assign';
import uiAction from '../constants/ui';

const defaultState = {
	videoPanel: {
		active: false
	}
};

export function ui(state = defaultState, action) {
	switch (action.type) {

	case uiAction.ACTIVATE_VIDEO_PANEL:
		state.videoPanel.active = true;
		state.videoPanel.localStream = action.localStream;
		state.videoPanel.remoteStream = action.remoteStream;
		return assign({}, state);

	case uiAction.DEACTIVATE_VIDEO_PANEL:
		state.videoPanel.active = false;
		state.videoPanel.localStream = null;
		state.videoPanel.remoteStream = null;
		return assign({}, state);

	default:
		return state;
	}
}
