import { createSlice } from "@reduxjs/toolkit";
import { postReq } from "./utils";
import { resetAll } from "./utils";

export const authenticate = () => async (dispatch) => {
  const res = await fetch("/api/auth/");
  const resBody = await res.json();
  if (res.ok && !resBody.errors) {
    dispatch(setUser(resBody));
  }
};

export const login = (credential, password) => async (dispatch) => {
  const res = await postReq("/api/auth/login", { credential, password });
  const resBody = await res.json();
  if (res.ok) dispatch(setUser(resBody));
  return resBody;
};

export const logout = () => async (dispatch) => {
  const res = await fetch("/api/auth/logout");
  if (res.ok) dispatch(resetAll());
};

export const signUp = (user) => async (dispatch) => {
  const res = await postReq("/api/auth/signup", user);
  const resBody = await res.json();
  if (res.ok) dispatch(setUser(resBody));
  return resBody;
};

export const validateEmail = (email) => async (_dispatch) => {
  const res = await postReq("/api/auth/validate_email", { email });
  const resBody = await res.json();
  return resBody;
};

export const validatePhone = (phone) => async (_dispatch) => {
  const res = await postReq("/api/auth/validate_phone", { phone });
  const resBody = await res.json();
  return resBody;
};

const initialState = { user: null, address: null, delivery: "delivery" };

export const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setLocation: (state, action) => {
      state.address = action.payload;
    },
  },
  extraReducers(builder) {
    builder.addCase(resetAll, () => initialState);
  },
});

export const { setUser, setLocation } = sessionSlice.actions;

export default sessionSlice.reducer;

export const selectUser = (state) => state.session.user;
