/* global describe it */
import expect from 'expect';
import jsdomReact from '../jsdomReact';
import React from 'react/addons';
import UserPic from '../../../web/src/components/user-pic';

const {TestUtils} = React.addons;

function setup() {
	const props = {
		avatar: 'http://placehold.it/50x50',
		online: true
	};

	const renderer = TestUtils.createRenderer();
	renderer.render(<UserPic {...props} />);
	const output = renderer.getRenderOutput();

	return {
		props,
		output,
		renderer
	};
}

describe('components', () => {
	jsdomReact();

	describe('UserPic', () => {
		it('should render correctly', () => {
			const {props, output} = setup();

			const [img, span] = output.props.children;
			expect(img.props.src).toBe(props.avatar);
		});
	});
});
