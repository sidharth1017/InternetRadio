import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuth: false,
  user: null,
  otp: {
    email: "",
    phone: "",
    hash: "",
  },

  //   const isAuth = false;
  // const user = {
  //   activated: false,
  // };
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action) => {
      const { user } = action.payload;
      state.user = user;
      if (user === null) {
        state.isAuth = false;
      } else {
        state.isAuth = true;
      }
    },
    setOtp: (state, action) => {
      const { phone, email, hash } = action.payload;
      state.otp.phone = phone;
      state.otp.email = email;
      state.otp.hash = hash;
    },
  },
});


// Action creators are generated for each case reducer function
export const { setAuth, setOtp } = authSlice.actions;

export default authSlice.reducer;
