import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// eslint-disable-next-line import/no-cycle
import { TokenInfo } from 'twitch-auth';
import { RootState } from '../../store';

const twitchSlice = createSlice({
  name: 'twitch',
  initialState: {
    user: {
      id: '',
      name: '',
    },
  },
  reducers: {
    setUser: (state, action: PayloadAction<TokenInfo>) => {
      state.user.id = action.payload.userId;
      state.user.name = action.payload.userName;
    },
  },
});

export const { setUser } = twitchSlice.actions;

export default twitchSlice.reducer;

export const selectTwitch = (state: RootState) => state.twitch;
