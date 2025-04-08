import { createSlice } from "@reduxjs/toolkit";
import Axios from "axios";

const dbSlice = createSlice({
  name: "db",
  initialState: {
    userAcc: "",
    loggedIn: false,
    role: "",
    reload: 0,
    // address: "0x75DED5e2eA4232Dcb97ebf23a0157210AB5B25D1",
    address: "0x6490b0ae3FF8983Bd190f7f0a07CD93121F9Def5",
  },
  reducers: {
    reload(state, action) {
      state.reload += 1;
    },
    userAccount(state, action) {
      state.userAcc = action.payload;
    },
    logIn(state, action) {
      state.loggedIn = true;
    },
    role(state, action) {
      state.role = action.payload;
    },
  },
});

export const dbActions = dbSlice.actions;

export default dbSlice;
