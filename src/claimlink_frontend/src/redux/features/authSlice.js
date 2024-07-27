// import { createSlice } from "@reduxjs/toolkit";
// import {
//   PlugLogin,
//   StoicLogin,
//   NFIDLogin,
//   IdentityLogin,
//   CreateActor,
// } from "ic-auth";
// import { Principal } from "@dfinity/principal";
// import { idlFactory } from "../../../../../.dfx/local/canisters/claimlink_backend/claimlink_backend.did.js";
// import { HttpAgent, Actor } from "@dfinity/agent";

// const canisterID = "bkyz2-fmaaa-aaaaa-qaaaq-cai";

// const isAuthenticated = sessionStorage.getItem("isAuthenticated") === "true";
// const principal = sessionStorage.getItem("principal");
// const identity = sessionStorage.getItem("identity")
//   ? JSON.parse(sessionStorage.getItem("identity"))
//   : null;

// const backendActorProperties = sessionStorage.getItem("backendActor")
//   ? JSON.parse(sessionStorage.getItem("backendActor"))
//   : null;

// const initialState = {
//   isAuthenticated,
//   principal: principal ? Principal.fromText(principal) : null,
//   identity,
//   backendActor: null,
// };

// const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
//     setAuthState: (state, action) => {
//       state.isAuthenticated = action.payload.isAuthenticated;
//       state.principal = action.payload.principal;
//       state.identity = action.payload.identity;
//       state.backendActor = action.payload.backendActor;
//     },
//     clearAuthState: (state) => {
//       state.isAuthenticated = false;
//       state.principal = null;
//       state.identity = null;
//       state.backendActor = null;
//     },
//   },
// });

// export const { setAuthState, clearAuthState } = authSlice.actions;

// const recreateActor = async (identity) => {
//   const agent = new HttpAgent({ identity, host: "https://ic0.app" });
//   if (process.env.DFX_NETWORK === "local") {
//     agent.fetchRootKey();
//   }
//   return Actor.createActor(idlFactory, {
//     agent,
//     canisterId: canisterID,
//   });
// };

// export const login = (provider) => async (dispatch) => {
//   let userObject = {
//     principal: "Not Connected.",
//     agent: undefined,
//     provider: "N/A",
//   };

//   try {
//     if (provider === "Plug") {
//       userObject = await PlugLogin();
//     } else if (provider === "Stoic") {
//       userObject = await StoicLogin();
//     } else if (provider === "NFID") {
//       userObject = await NFIDLogin();
//     } else if (provider === "Identity") {
//       userObject = await IdentityLogin();
//     }

//     if (!userObject.agent) {
//       throw new Error("Agent not initialized");
//     }

//     const identity = userObject.agent._identity;
//     const principal = Principal.fromText(userObject.principal);
//     const actor = await CreateActor(userObject.agent, idlFactory, canisterID);

//     dispatch(
//       setAuthState({
//         isAuthenticated: true,
//         principal,
//         identity,
//         backendActor: actor,
//       })
//     );

//     const expirationTime = Date.now() + 1000 * 60 * 60 * 24;
//     sessionStorage.setItem("isAuthenticated", true);
//     sessionStorage.setItem("principal", userObject.principal);
//     sessionStorage.setItem(
//       "identity",
//       JSON.stringify(userObject.agent._identity)
//     );
//     sessionStorage.setItem(
//       "backendActor",
//       JSON.stringify({
//         canisterId: canisterID,
//         identity: JSON.stringify(identity),
//       })
//     );
//     sessionStorage.setItem("expirationTime", expirationTime.toString());
//   } catch (error) {
//     console.error("Login error: ", error);
//   }
// };

// export const logout = () => (dispatch) => {
//   dispatch(clearAuthState());
//   sessionStorage.removeItem("isAuthenticated");
//   sessionStorage.removeItem("principal");
//   sessionStorage.removeItem("identity");
//   sessionStorage.removeItem("backendActor");
//   sessionStorage.removeItem("expirationTime");
// };

// if (isAuthenticated && backendActorProperties) {
//   (async () => {
//     const identity = JSON.parse(backendActorProperties.identity);
//     const actor = await recreateActor(identity);
//     initialState.backendActor = actor;
//   })();
// }

// export default authSlice.reducer;
