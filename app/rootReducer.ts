import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { History } from 'history';
// eslint-disable-next-line import/no-cycle
import counterReducer from './features/counter/counterSlice';
// eslint-disable-next-line import/no-cycle
import chatReducer from './features/chat/chatSlice';

export default function createRootReducer(history: History) {
  return combineReducers({
    router: connectRouter(history),
    counter: counterReducer,
    chat: chatReducer,
  });
}
