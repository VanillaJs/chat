import userActionType from '../constants/user';
import videoStream from '../video-stream';
import transport from '../socket';

export function setUserData(user, contacts) {
	return {
		type: userActionType.SET_USER_DATA,
		user,
		contacts
	};
}

export function setUserId(id) {
	return {
		type: userActionType.SET_ID,
		id
	};
}

export function fetchUserData() {
	return dispatch => {
		transport.socket.on('s.user.set_data', function handler({data, contacts}) {
			dispatch(setUserData(data, contacts));
			videoStream.init(data._id);
			transport.socket.removeEventListener(handler);
		});
		transport.socket.emit('c.user.get_data');
	};
}
