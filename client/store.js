import {createStore, applyMiddleware} from 'redux';
import thunkMiddleware from 'redux-thunk';
import reducers from './reducers';

const middlewares = [thunkMiddleware];

function logger() {
	return next => action => {
		console.log('send action: ', action.type || typeof action);
		next(action);
	};
}

if (DEBUG) {
	middlewares.push(logger);
}

const createStoreWithMiddleware = applyMiddleware(...middlewares)(createStore);
const store = createStoreWithMiddleware(reducers);

export default store;
