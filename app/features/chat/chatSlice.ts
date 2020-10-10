import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Message } from 'twitch-js';
// eslint-disable-next-line import/no-cycle
import { RootState } from '../../store';

type MessagePayload = {
  message: Message;
};

const randomColors = [
  '#FF0067',
  '#509dba',
  '#ffd8e8',
  '#7b25aa',
  '#c0d6e4',
  '#cc8d9b',
  '#d6d498',
  '#ff82ab',
  '#319A24',
  '#FF4500',
  '#00FF7F',
  '#5F9EA0',
  '#FF3333',
  '#3333FF',
  '#008000',
  '#B22222',
  '#9ACD32',
  '#FF4500',
  '#5F9EA0',
  '#1E90FF',
  '#8A2BE2',
  '#00FF7F',
];

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    messages: [] as Message[],
    currentMessage: 0,
    userColors: {},
  },
  reducers: {
    addMessage: (state, action: PayloadAction<MessagePayload>) => {
      if (
        !action.payload.message.tags.color &&
        state.userColors[action.payload.message.username]
      ) {
        const color =
          randomColors[Math.floor(Math.random() * randomColors.length)];

        action.payload.message.tags.color = state.userColors[
          action.payload.message.username
        ] = color;
      }
      state.messages.push(action.payload.message);
    },
    nextMessage: (state) => {
      if (state.currentMessage < state.messages.length - 1) {
        state.currentMessage += 1;
      }
    },
    backMessage: (state) => {
      if (state.currentMessage > 0) {
        state.currentMessage -= 1;
      }
    },
  },
});

export const { addMessage, backMessage, nextMessage } = chatSlice.actions;

export default chatSlice.reducer;

export const selectChat = (state: RootState) => state.chat;
