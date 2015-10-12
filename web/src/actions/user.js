import userActionType from '../constants/user';
import transport from '../socket';

export function setUserData(user, contacts) {
	return {
		type: userActionType.SET_USER_DATA,
		user,
		contacts
	};
}

export function updateUserData(user) {
	return {
		type: userActionType.UPDATE_USER_DATA,
		user
	};
}

export function setUserId(id) {
	return {
		type: userActionType.SET_ID,
		id
	};
}

export function toggleEditable(val) {
	return {
		type: userActionType.SET_EDITABLE,
		val
	};
}

export function updateProfile(dataSend) {
	return dispatch => {
		transport.socket.on('s.user.update_data', function handler(data) {
			dispatch(toggleEditable(false));
			dispatch(updateUserData(data));
		});
		transport.socket.emit('c.user.update_data', dataSend);
	};
}

export function fetchUserData() {
	return dispatch => {
		transport.socket.on('s.user.set_data', function handler({data, contacts}) {
			dispatch(setUserData(data, contacts));
			transport.socket.removeEventListener(handler);
		});
		transport.socket.emit('c.user.get_data');
	};
}
