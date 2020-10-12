import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// eslint-disable-next-line import/no-cycle
import { PrivateMessage } from 'twitch-chat-client';
import { RootState } from '../../store';

export type Message = {
  userName: string;
  message: string;
  msgData: PrivateMessage;
  channel?: string;
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
    messages: [] as PrivateMessage[],
    currentMessage: 0,
    userColors: {},
  },
  reducers: {
    addMessage: (state, action: PayloadAction<Message>) => {
      if (
        !action.payload.msgData.userInfo.color &&
        state.userColors[action.payload.message.username]
      ) {
        const color =
          randomColors[Math.floor(Math.random() * randomColors.length)];

        action.payload.msgData.userColor = state.userColors[
          action.payload.message.username
        ] = color;
      }
      state.messages.push(action.payload.msgData);
    },
    nextMessage: (state) => {
      if (state.currentMessage < state.messages.length - 1) {
        state.currentMessage += 1;
      }
    },
    goToNewestMessage: (state) => {
      state.currentMessage = state.messages.length - 1;
    },
    backMessage: (state) => {
      if (state.currentMessage > 0) {
        state.currentMessage -= 1;
      }
    },
  },
});

export const {
  addMessage,
  backMessage,
  nextMessage,
  goToNewestMessage,
} = chatSlice.actions;

export default chatSlice.reducer;

export const selectChat = (state: RootState) => state.chat;
