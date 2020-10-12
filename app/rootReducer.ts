import { connectRouter } from 'connected-react-router';
import { History } from 'history';
import { combineReducers } from 'redux';
// eslint-disable-next-line import/no-cycle
import chatReducer from './features/chat/chatSlice';
// eslint-disable-next-line import/no-cycle
import twitchReducer from './features/chat/twitchSlice';
// eslint-disable-next-line import/no-cycle
import counterReducer from './features/counter/counterSlice';

export default function createRootReducer(history: History) {
  return combineReducers({
    router: connectRouter(history),
    counter: counterReducer,
    chat: chatReducer,
    twitch: twitchReducer,
  });
}
