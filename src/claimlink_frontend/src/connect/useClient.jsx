import React, { createContext, useContext, useEffect, useState } from "react";
import {
  PlugLogin,
  StoicLogin,
  NFIDLogin,
  IdentityLogin,
  CreateActor,
} from "ic-auth";
import { Principal } from "@dfinity/principal";
// import { idlFactory } from "../../../../.dfx/local/canisters/claimlink_backend/claimlink_backend.did.js";

const AuthContext = createContext();

const canisterID = "bkyz2-fmaaa-aaaaa-qaaaq-cai";

export const useAuthClient = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [principal, setPrincipal] = useState(null);
  const [identity, setIdentity] = useState(null);
  const [backendActor, setBackendActor] = useState(null);

  useEffect(() => {
    const checkSession = () => {
      try {
        const savedPrincipal = sessionStorage.getItem("principal");
        const savedIdentity = sessionStorage.getItem("identity");

        if (savedPrincipal && savedIdentity) {
          const parsedPrincipal = Principal.fromText(savedPrincipal);
          const parsedIdentity = JSON.parse(savedIdentity);
          setPrincipal(parsedPrincipal);
          setIdentity(parsedIdentity);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Error checking session: ", error);
      }
    };

    checkSession();
  }, []);

  const login = async (provider) => {
    try {
      let userObject = {
        principal: "Not Connected.",
        agent: undefined,
        provider: "N/A",
      };

      switch (provider) {
        case "Plug":
          userObject = await PlugLogin();
          break;
        case "Stoic":
          userObject = await StoicLogin();
          break;
        case "NFID":
          userObject = await NFIDLogin();
          break;
        case "Identity":
          userObject = await IdentityLogin();
          break;
        default:
          throw new Error("Unknown provider");
      }

      if (!userObject.agent) {
        throw new Error("Agent not initialized");
      }

      const identity = userObject.agent._identity;
      const principal = Principal.fromText(userObject.principal);
      const actor = await CreateActor(userObject.agent, idlFactory, canisterID);

      setIsAuthenticated(true);
      setPrincipal(principal);
      setIdentity(identity);
      setBackendActor(actor);

      const expirationTime = Date.now() + 1000 * 60 * 60 * 24;
      sessionStorage.setItem("isAuthenticated", "true");
      sessionStorage.setItem("principal", userObject.principal);
      sessionStorage.setItem("identity", JSON.stringify(identity));
      sessionStorage.setItem(
        "backendActor",
        JSON.stringify({
          canisterId: canisterID,
          identity: JSON.stringify(identity),
        })
      );
      sessionStorage.setItem("expirationTime", expirationTime.toString());
    } catch (error) {
      console.error("Login error: ", error);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setPrincipal(null);
    setIdentity(null);
    setBackendActor(null);

    sessionStorage.removeItem("isAuthenticated");
    sessionStorage.removeItem("principal");
    sessionStorage.removeItem("identity");
    sessionStorage.removeItem("backendActor");
    sessionStorage.removeItem("expirationTime");
  };

  return {
    isAuthenticated,
    login,
    logout,
    principal,
    backendActor,
    identity,
  };
};

export const AuthProvider = ({ children }) => {
  const auth = useAuthClient();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
