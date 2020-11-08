import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// eslint-disable-next-line import/no-cycle
import { PrivateMessage } from 'twitch-chat-client';
import {
  PubSubRedemptionMessage,
  PubSubSubscriptionMessage
} from 'twitch-pubsub-client/lib';
import { RootState } from '../../store';

export type MessagePayload = {
  userName: string;
  message: string;
  msgData: PrivateMessage;
  channel?: string;
};

export type DisplayItem = UserMessage | EventMessage;
export type EventMessage = PubSubRedemptionMessage | PubSubSubscriptionMessage;

export type UserMessage = {
  type: 'message';
  msgData: PrivateMessage;
  user: {
    color: string | undefined;
  };
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
    messages: [] as UserMessage[],
    currentMessage: 0,
    userColors: {},
  },
  reducers: {
    addMessage: (state, action: PayloadAction<MessagePayload>) => {
      // Don't add redemption messages
      if (action.payload.msgData.tags.get('custom-reward-id')) {
        return;
      }

      let userColor =
        action.payload.msgData.userInfo.color ||
        state.userColors[action.payload.msgData.userInfo.userName];

      if (!userColor) {
        const color =
          randomColors[Math.floor(Math.random() * randomColors.length)];

        userColor = state.userColors[
          action.payload.msgData.userInfo.userName
        ] = color;
      }
      state.messages.push({
        user: {
          color: userColor,
        },
        msgData: action.payload.msgData,
      });
    },
    addRawMessage: (state, action: PayloadAction<EventMessage>) => {
      state.messages.push(action.payload);
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
  addRawMessage,
  backMessage,
  nextMessage,
  goToNewestMessage,
} = chatSlice.actions;

export default chatSlice.reducer;

export const selectChat = (state: RootState) => state.chat;
