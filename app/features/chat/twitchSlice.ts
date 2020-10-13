import { createSlice, PayloadAction } from '@reduxjs/toolkit';
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
    clearUser: (state) => {
      state.user = {
        id: '',
        name: '',
      };
    },
  },
});

export const { setUser, clearUser } = twitchSlice.actions;

export default twitchSlice.reducer;

export const selectTwitch = (state: RootState) => state.twitch;
