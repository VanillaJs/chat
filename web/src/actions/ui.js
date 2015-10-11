import uiAction from '../constants/ui';
import videoStream from '../video-stream';

export function activateVideoPanel(localStream, remoteStream) {
	return {
		type: uiAction.ACTIVATE_VIDEO_PANEL,
		localStream,
		remoteStream
	};
}

export function deactivateVideoPanel() {
	videoStream.stop();

	return {
		type: uiAction.DEACTIVATE_VIDEO_PANEL
	};
}
