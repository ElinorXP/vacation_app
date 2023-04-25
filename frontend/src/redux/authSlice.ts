import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { userLogin } from './authActions';

import { getTokenFromLocalStorage } from '../utils/User';

const initialState = {
    userToken: getTokenFromLocalStorage(),
    user: null,
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
      console.log("token", payload.token);
      state.userToken = payload.token
      state.user = payload.user;
    });
    builder.addCase(userLogin.rejected, (state, action) => {
      state.userToken = null
    });
  },
})

export default authSlice.reducer;