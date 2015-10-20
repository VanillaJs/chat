/* global describe it */
import expect from 'expect';
import jsdomReact from '../jsdomReact';
import React from 'react/addons';
import ChannelFilter from '../../../web/src/components/channel-filter';

const {TestUtils} = React.addons;

describe('ChannelFilter tests', () => {
	var onTextChange;
	var channelFilter;

	jsdomReact();

	beforeEach(function() {
		onTextChange = expect.createSpy();
		channelFilter = <ChannelFilter onTextChange={onTextChange} />;
		channelFilter = TestUtils.renderIntoDocument(channelFilter);
	});

	it('should invoke onTextChange then key pressed (debounced call)', (done) => {
		var node = channelFilter.refs.input;
		node.getDOMNode().value = 'test';
		TestUtils.Simulate.keyUp(node, {});
		setTimeout(() => {
			expect(onTextChange.calls.length).toEqual(1, 'need to be called once');
			expect(onTextChange.calls[0].arguments[0]).toEqual('test', 'must send "test" value to handler');

			done();
		}, 300);
	});

	it('should clear input after click', () => {
		var inputNode = channelFilter.refs.input;
		var closeNode = TestUtils.findRenderedDOMComponentWithClass(channelFilter, 'contacts-filter__close');
		inputNode.getDOMNode().value = 'test';
		TestUtils.Simulate.click(closeNode);
		expect(inputNode.getDOMNode().value).toEqual('', 'after clear input value must to be empty');
	});
});
