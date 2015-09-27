import userActionType from '../constants/user';
import {socket} from '../socket';

export function setUserData(user, contacts) {
	return {
		type: userActionType.SET_USER_DATA,
		user,
		contacts
	};
}

export function fetchUserData() {
	return dispatch => {
		socket.on('s.user.set_data', function handler({data, contacts}) {
			dispatch(setUserData(data, contacts));
			socket.removeEventListener(handler);
		});
		socket.emit('c.user.get_data');
	};
}
