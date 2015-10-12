import uiActionType from '../constants/ui';

export function setError(errorName) {
	return {
		type: uiActionType.SET_ERROR,
		errorName
	};
}

export function removeError(errorName) {
	return {
		type: uiActionType.REMOVE_ERROR,
		errorName
	};
}
