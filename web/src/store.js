import {createStore, applyMiddleware} from 'redux';
import thunkMiddleware from 'redux-thunk';
import reducers from './reducers';

function logger() {
	return next => action => {
		console.log('send action: ', action.type || typeof action);
		next(action);
	};
}

const createStoreWithMiddleware = applyMiddleware(logger, thunkMiddleware)(createStore);
const store = createStoreWithMiddleware(reducers);

export default store;
