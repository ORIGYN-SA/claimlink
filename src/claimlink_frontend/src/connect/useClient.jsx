import React, { createContext, useContext, useState, useEffect } from "react";
import { useIdentityKit } from "@nfid/identitykit/react";
import { createActor } from "../../../declarations/claimlink_backend";

const AuthContext = createContext();

const canisterID = process.env.CANISTER_ID_CLAIMLINK_BACKEND;

export const useAuthClient = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [delegationExpiry, setDelegationExpiry] = useState(null);
  const { user, connect, disconnect, identity, icpBalance } = useIdentityKit();

  const checkDelegationExpiry = () => {
    if (delegationExpiry) {
      const currentTime = Date.now();
      console.log(
        "Delegation Expiry Time:",
        new Date(delegationExpiry).toLocaleString()
      );

      if (currentTime >= delegationExpiry) {
        console.log("Delegation expired, logging out...");
        disconnect();
        setIsConnected(false);
      }
    }
  };

  useEffect(() => {
    if (user && identity !== "AnonymousIdentity") {
      setIsConnected(true);

      const expiryTime = Number(
        identity?._delegation?.delegations?.[0]?.delegation?.expiration
      );

      if (expiryTime) {
        setDelegationExpiry(expiryTime / 1e6);
      }

      const interval = setInterval(checkDelegationExpiry, 1000);

      return () => clearInterval(interval);
    } else {
      setIsConnected(false);
    }
  }, [user]);

  return {
    isConnected,
    delegationExpiry,
    login: connect,
    logout: disconnect,
    balance: icpBalance,
    principal: user?.principal,
    backend: createActor(canisterID, {
      agentOptions: { identity, verifyQuerySignatures: false },
    }),
  };
};

export const AuthProvider = ({ children }) => {
  const auth = useAuthClient();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
// Access AuthContext here

// import React, { createContext, useContext, useEffect, useState } from "react";
// import {
//   PlugLogin,
//   StoicLogin,
//   NFIDLogin,
//   IdentityLogin,
//   CreateActor,
// } from "ic-auth";
// import { Principal } from "@dfinity/principal";
// //import { createActor } from "../../../../.dfx/local/canisters/claimlink_backend";
// import { createActor } from "../../../declarations/claimlink_backend";
// import { AuthClient } from "@dfinity/auth-client";
// import { idlFactory } from "../../../declarations/claimlink_backend/claimlink_backend.did.js";

// const AuthContext = createContext();

// const canisterID = process.env.CANISTER_ID_CLAIMLINK_BACKEND;
// const whitelist = [process.env.CANISTER_ID_CLAIMLINK_BACKEND];

// export const useAuthClient = () => {
//   const [isConnected, setIsConnected] = useState(false);
//   const [principal, setPrincipal] = useState(null);
//   const [backend, setBackend] = useState(null);
//   const [identity, setIdentity] = useState(null);
//   const [authClient, setAuthClient] = useState(null);
//   const loginStatus = localStorage.getItem("loginStatus");

//   useEffect(() => {
//     const initAuthClient = async () => {
//       const client = await AuthClient.create();
//       setAuthClient(client);
//       const isConnected = await client.isAuthenticated();
//       const identity = client.getIdentity();
//       const principal = identity.getPrincipal();
//       setIsConnected(isConnected);
//       setIdentity(identity);
//       setPrincipal(principal);

//       if (createActor && loginStatus === null) {
//         const backendActor = createActor(canisterID, {
//           agentOptions: { identity },
//         });
//         setBackend(backendActor);
//       }
//     };
//     initAuthClient();
//   }, []);

//   useEffect(() => {
//     const handlePlugLogin = async () => {
//       const plugPrincipal = principal?.toText();
//       if (plugPrincipal === "2vxsx-fae") {
//         let userObject = await PlugLogin(whitelist);
//         const agent = userObject.agent;
//         const principal = Principal.fromText(userObject.principal);
//         const actor = await CreateActor(agent, idlFactory, canisterID);
//         setBackend(actor);
//         setIsConnected(true);
//         setPrincipal(principal);
//         setIdentity(agent._identity);

//         await authClient.login({
//           agent,
//           onSuccess: () => {
//             setIsConnected(true);
//             setPrincipal(principal);
//             setIdentity(agent._identity);
//           },
//         });
//       }
//     };

//     if (loginStatus) {
//       handlePlugLogin();
//     }
//   }, [principal]);

//   const login = async (provider) => {
//     if (authClient) {
//       let userObject = {
//         principal: "Not Connected.",
//         agent: undefined,
//         provider: "N/A",
//       };
//       if (provider === "Plug") {
//         userObject = await PlugLogin(whitelist);
//       } else if (provider === "Stoic") {
//         userObject = await StoicLogin();
//       } else if (provider === "NFID") {
//         userObject = await NFIDLogin();
//       } else if (provider === "Identity") {
//         userObject = await IdentityLogin();
//       }

//       console.log("User Object:", userObject);
//       const agent = userObject.agent;
//       const identity = await userObject.agent._identity;
//       const principal = Principal.fromText(userObject.principal);
//       const actor = await CreateActor(agent, idlFactory, canisterID);
//       setBackend(actor);
//       setIsConnected(true);
//       setPrincipal(principal);
//       setIdentity(identity);

//       if (userObject.provider !== "Plug") {
//         await authClient.login({
//           identity,
//           onSuccess: () => {
//             setIsConnected(true);
//             setPrincipal(principal);
//             setIdentity(identity);
//           },
//         });
//       }
//       if (!isConnected && userObject.provider === "Plug") {
//         localStorage.setItem("loginStatus", true);
//       }
//     }
//   };

//   const disconnect = async () => {
//     if (authClient) {
//       await authClient.logout();
//       setIsConnected(false);
//       setPrincipal(null);
//       setIdentity(null);
//     }
//     localStorage.removeItem("loginStatus");
//   };

//   return {
//     isConnected,
//     login,
//     disconnect,
//     principal,
//     backend,
//     identity,
//   };
// };

// export const AuthProvider = ({ children }) => {
//   const auth = useAuthClient();
//   return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
// };

// export const useBackend = () => {};

// export const useAuth = () => useContext(AuthContext);
