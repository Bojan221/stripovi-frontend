import { createSlice } from "@reduxjs/toolkit";
import type { UserState } from "../types/User";

const initialState: UserState = {
  accessToken: localStorage.getItem("accessToken"),
  user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")!) : null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginUser: (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.user = action.payload.user;
      localStorage.setItem("accessToken", action.payload.accessToken);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
    },
    logoutUser: (state) => {
      state.accessToken = null;
      state.user = null;
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
    },
    updateUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },

    updateUserNames: (state,action) => {
      const updateUser = { ...state.user, firstName: action.payload.firstName, lastName: action.payload.lastName } as any;
      state.user = updateUser;
      localStorage.setItem("user", JSON.stringify(updateUser));
    },
    updateUserEmail: (state, action) => {
      const updatedUser = { ...state.user, email: action.payload.email } as any;
      state.user = updatedUser;
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  },
});

export const { loginUser, logoutUser, updateUser, updateUserNames, updateUserEmail } = userSlice.actions;
export default userSlice.reducer;
