import React, {Component, PropTypes} from 'react';

import './index.sass';

class VideoPanel extends Component {
	static propTypes = {
		local: PropTypes.object,
		remote: PropTypes.object,
		deactivateVideoPanel: PropTypes.func
	}

	componentDidMount() {
		const {local, remote} = this.refs;
		local.getDOMNode().appendChild(this.renderVideo(this.props.local));
		remote.getDOMNode().appendChild(this.renderVideo(this.props.remote));
	}

	renderVideo(stream) {
		const video = document.createElement('video');
		video.setAttribute('autoplay', true);
		video.setAttribute('muted', true);
		video.src = window.URL.createObjectURL(stream);

		return video;
	}

	render() {
		return (
			<div className="video-panel">
				<div ref="remote" className="video-panel__video"></div>
				<div ref="local" className="video-panel__video"></div>
				<span onClick={this.props.deactivateVideoPanel} className="video-panel__close">&times;</span>
			</div>
		);
	}
}

export default VideoPanel;
