import {createStore, combineReducers, applyMiddleware} from 'redux';
import thunkMiddleware from 'redux-thunk';
import * as reducers from './reducers';

function logger() {
	return next => action => {
		console.log('send action: ', action.type || typeof action);
		next(action);
	};
}

const app = combineReducers(reducers);
const createStoreWithMiddleware = applyMiddleware(logger, thunkMiddleware)(createStore);
const store = createStoreWithMiddleware(app);

export default store;
