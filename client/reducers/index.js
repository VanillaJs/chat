import {combineReducers} from 'redux';
import {channels} from './channels';
import {messages} from './messages';
import {user} from './user';
import {ui} from './ui';

const app = combineReducers({channels, messages, user, ui});

export default app;
