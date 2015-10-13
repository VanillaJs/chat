import React, {Component, PropTypes} from 'react';
import './index.sass';

class WelcomePage extends Component {
	static propTypes = {
		children: PropTypes.object
	}

	render() {
		return (
			<div className="welcome-page">
				{this.props.children}
				<div className="welcome-page__video">
					<video muted="true" controls="" loop="true" autoPlay="true">
						<source
							src="https://dl.dropboxusercontent.com/u/537302/benjamin_wu--20140325_teapot_hill.mp4"
							type="video/mp4"
							loop="true" />
					</video>
				</div>
			</div>
		);
	}
}

export default WelcomePage;
