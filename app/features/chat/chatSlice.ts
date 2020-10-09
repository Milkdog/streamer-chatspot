import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Message } from 'twitch-js';
// eslint-disable-next-line import/no-cycle
import { RootState } from '../../store';

type MessagePayload = {
  message: Message;
};

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    messages: [] as Message[],
  },
  reducers: {
    addMessage: (state, action: PayloadAction<MessagePayload>) => {
      state.messages.push(action.payload.message);
    },
  },
});

export const { addMessage } = chatSlice.actions;

export default chatSlice.reducer;

export const selectChat = (state: RootState) => state.chat.messages;
