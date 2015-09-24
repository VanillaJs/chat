import {combineReducers} from 'redux';
import {channels} from './channels';
import {messages} from './messages';
import {user} from './user';

const app = combineReducers({channels, messages, user});

export default app;
