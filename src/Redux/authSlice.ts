import { createSlice } from "@reduxjs/toolkit";

const authString = localStorage.getItem("quick_huire");
const auth = authString ? JSON.parse(authString) : null;

const initialState = {
  accessToken: auth?.accessToken || null,
  user: auth?.user || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    userLoggedIn: (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.user = action.payload.user;

      localStorage.setItem(
        "quick_huire",
        JSON.stringify({
          accessToken: action.payload.accessToken,
          user: action.payload.user,
        })
      );
    },

    userLoggedOut: (state) => {
      localStorage.removeItem("quick_huire");
      state.accessToken = null;
      state.user = null;
    },
  },
});

export const { userLoggedIn, userLoggedOut } = authSlice.actions;
export default authSlice.reducer;