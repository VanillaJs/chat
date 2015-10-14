/* global describe it */
import expect from 'expect';
import jsdomReact from '../jsdomReact';
import React from 'react/addons';
import Channel from '../../../web/src/components/channel';

const {TestUtils} = React.addons;

const getDefaultData = {
	channel: {
		_id: '2',
		avatar: 'avatar.jpg',
		color: '#123',
		name: 'alice',
		is_online: false
	},
	current: '1'
};

describe('Channel component tests', () => {
	let changeChannel;
	let channel;
	let dom;

	jsdomReact();

	beforeEach(function() {
		changeChannel = expect.createSpy();
		channel = <Channel changeChannel={changeChannel} {...getDefaultData} unread={1} lastMessage="" active />;
		channel = TestUtils.renderIntoDocument(channel);
		dom = React.findDOMNode(channel);
	});

	it('render component', () => {
		expect(dom.querySelector('.channel__message-header').textContent).toEqual('alice');
		expect(dom.querySelector('.channel__message-unread').textContent).toEqual(1);
	});

	it('channel activation', () => {
		TestUtils.Simulate.click(dom, {});
		expect(changeChannel.calls.length).toEqual(1, 'change channel by click');
		channel.props.current = getDefaultData.channel._id;
		TestUtils.Simulate.click(dom, {});
		expect(changeChannel.calls.length).toEqual(1, 'dont activate channel repeatedly');
	});
});
