import { configureStore } from "@reduxjs/toolkit";
import formReducer from "../features/formSlice";
import qrManagerReducer from "../features/qrManagerSlice";
import minterReducer from "../features/minterSlice";
import dispensersReducer from "../features/dispenserSlice";
// import authReducer from "../features/authSlice";

export const store = configureStore({
  reducer: {
    // auth: authReducer,
    form: formReducer,
    qrManager: qrManagerReducer,
    minter: minterReducer,
    dispensers: dispensersReducer,
  },
});
