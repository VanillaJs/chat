/* global describe it */
import expect from 'expect';
import * as actions from '../../../web/src/actions/messages';
import * as types from '../../../web/src/constants/messages';

describe('messages actions', () => {
	it('should add remote server message', () => {
		const remoteMessage = {userId: 'BgfVgh54Chkgjk', message: 'hello word'};
		const expectedAction = {
			type: types.ADD_REMOTE_MESSAGE,
			userId: 'BgfVgh54Chkgjk',
			message: 'hello word'
		};
		expect(actions.addRemoteMessage(remoteMessage)).toEqual(expectedAction);
	});
});
