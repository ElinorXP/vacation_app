import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { userLogin } from './authActions';

import { getTokenFromLocalStorage, removeTokenInLocalStorage } from '../utils/User';

const initialState = {
    userToken: getTokenFromLocalStorage(),
    user: undefined,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.userToken = null;
      state.user = undefined;
      removeTokenInLocalStorage();
      return state;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(userLogin.fulfilled, (state, { payload }) => {
      state.userToken = payload.token;
      state.user = payload.user;
    });
    builder.addCase(userLogin.rejected, (state, action) => {
      state.userToken = null;
      state.user = undefined;
      removeTokenInLocalStorage();
    });
  },
})

export const { logout } = authSlice.actions;
export default authSlice.reducer;