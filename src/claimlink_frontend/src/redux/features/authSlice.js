import { createSlice } from "@reduxjs/toolkit";
import {
  PlugLogin,
  StoicLogin,
  NFIDLogin,
  IdentityLogin,
  HelloIDL,
  CreateActor,
} from "ic-auth";
import { Principal } from "@dfinity/principal";
import { idlFactory } from "../../../../declarations/claimlink_backend/claimlink_backend.did.js";

const canisterID = "be2us-64aaa-aaaaa-qaabq-cai";
const whitelist = ["be2us-64aaa-aaaaa-qaabq-cai"];

const initialState = {
  isAuthenticated: false,
  principal: null,
  identity: null,
  backendActor: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthState: (state, action) => {
      state.isAuthenticated = action.payload.isAuthenticated;
      state.principal = action.payload.principal;
      state.identity = action.payload.identity;
      state.backendActor = action.payload.backendActor;
    },
    clearAuthState: (state) => {
      state.isAuthenticated = false;
      state.principal = null;
      state.identity = null;
      state.backendActor = null;
    },
  },
});

export const { setAuthState, clearAuthState } = authSlice.actions;

export const login = (provider) => async (dispatch) => {
  let userObject = {
    principal: "Not Connected.",
    agent: undefined,
    provider: "N/A",
  };

  try {
    if (provider === "Plug") {
      userObject = await PlugLogin(whitelist);
    } else if (provider === "Stoic") {
      userObject = await StoicLogin();
    } else if (provider === "NFID") {
      userObject = await NFIDLogin();
    } else if (provider === "Identity") {
      userObject = await IdentityLogin();
    }

    if (!userObject.agent) {
      throw new Error("Agent not initialized");
    }

    const identity = userObject.agent._identity;
    const principal = Principal.fromText(userObject.principal);
    const actor = await CreateActor(userObject.agent, idlFactory, canisterID);

    dispatch(
      setAuthState({
        isAuthenticated: true,
        principal,
        identity,
        backendActor: actor,
      })
    );

    const expirationTime = Date.now() + 1000 * 60 * 60 * 24;
    sessionStorage.setItem("isAuthenticated", "true");
    sessionStorage.setItem("principal", userObject.principal);
    sessionStorage.setItem(
      "identity",
      JSON.stringify(userObject.agent._identity)
    );
    sessionStorage.setItem("expirationTime", expirationTime.toString());
  } catch (error) {
    console.error("Login error: ", error);
  }
};

export const logout = () => (dispatch) => {
  dispatch(clearAuthState());
  sessionStorage.removeItem("isAuthenticated");
  sessionStorage.removeItem("principal");
  sessionStorage.removeItem("identity");
  sessionStorage.removeItem("expirationTime");
};

export default authSlice.reducer;
