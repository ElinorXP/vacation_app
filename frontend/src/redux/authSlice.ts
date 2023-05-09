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
  reducers: {},
  extraReducers: (builder) => {
    // login user
    // ["userLogin.pending"]: (state) => {
    //   //state.user.loading = true
    //   //state.error = null
    // },
    builder.addCase(userLogin.fulfilled, (state, { payload }) => {
      //state.loading = false
      state.userToken = payload.token
      state.user = payload.user;
    });
    builder.addCase(userLogin.rejected, (state, action) => {
      state.userToken = null
      removeTokenInLocalStorage();
    });
  },
})

export default authSlice.reducer;