import {ADD_MESSAGE} from '../constants';

export function addMessage(text) {
	return {
		type: ADD_MESSAGE,
		text,
	};
}
