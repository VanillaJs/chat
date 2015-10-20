import uiActionType from '../constants/ui';
import videoStream from '../video-stream';

export function setError(errorName) {
	return {
		type: uiActionType.SET_ERROR,
		errorName
	};
}

export function removeError(errorName) {
	return {
		type: uiActionType.REMOVE_ERROR,
		errorName
	};
}

export function activateVideoPanel(localStream, remoteStream) {
	return {
		type: uiActionType.ACTIVATE_VIDEO_PANEL,
		localStream,
		remoteStream
	};
}

export function deactivateVideoPanel() {
	videoStream.stop();

	return {
		type: uiActionType.DEACTIVATE_VIDEO_PANEL
	};
}
