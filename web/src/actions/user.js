import actionTypes from '../constants/user';
import {socket} from '../socket';

export function setUserData(user, contacts) {
	return {
		type: actionTypes.SET_USER_DATA,
		user,
		contacts,
	};
}

export function fetchUserData() {
	return dispatch => {
		socket.emit('c.user.get_data');
		socket.on('s.user.set_data', function handler({userData, contacts}) {
			dispatch(setUserData(userData, contacts));
			socket.removeEventListener(handler);
		});
	};
}
