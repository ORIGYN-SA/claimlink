import React, { createContext, useContext, useEffect, useState } from "react";
import {
  PlugLogin,
  StoicLogin,
  NFIDLogin,
  IdentityLogin,
  CreateActor,
} from "ic-auth";
import { Principal } from "@dfinity/principal";
import { idlFactory } from "../../../declarations/claimlink_backend/claimlink_backend.did.js";
import { HttpAgent, Actor } from "@dfinity/agent";

const AuthContext = createContext();

const canisterID = "bkyz2-fmaaa-aaaaa-qaaaq-cai";

export const useAuthClient = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [principal, setPrincipal] = useState(null);
  const [identity, setIdentity] = useState(null);
  const [backendActor, setBackendActor] = useState(null);

  const loginStatus = sessionStorage.getItem("isAuthenticated") === "true";

  const recreateActor = async (identity) => {
    try {
      const agent = new HttpAgent({ identity, host: "https://ic0.app" });
      if (process.env.DFX_NETWORK === "local") {
        agent.fetchRootKey();
      }
      return Actor.createActor(idlFactory, {
        agent,
        canisterId: canisterID,
      });
    } catch (error) {
      console.error("Error recreating actor: ", error);
    }
  };

  useEffect(() => {
    if (loginStatus) {
      const savedPrincipal = sessionStorage.getItem("principal");
      const savedIdentity = sessionStorage.getItem("identity");
      const backendActorProperties = sessionStorage.getItem("backendActor");

      if (savedPrincipal && savedIdentity && backendActorProperties) {
        try {
          const parsedIdentity = JSON.parse(savedIdentity);
          setPrincipal(Principal.fromText(savedPrincipal));
          recreateActor(parsedIdentity).then(setBackendActor);
          setIdentity(parsedIdentity);
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Error parsing session storage data: ", error);
          logout(); // Optionally clear session on error
        }
      }
    }
  }, [loginStatus]);

  const login = async (provider) => {
    let userObject = {
      principal: "Not Connected.",
      agent: undefined,
      provider: "N/A",
    };

    try {
      if (provider === "Plug") {
        userObject = await PlugLogin();
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
