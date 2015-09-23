import {combineReducers} from 'redux';
import {channels} from './channels';
import {contacts} from './contacts';
import {messages} from './messages';
import {user} from './user';

const app = combineReducers({channels, contacts, messages, user});

export default app;
