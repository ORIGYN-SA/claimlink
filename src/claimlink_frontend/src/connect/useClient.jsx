import React, { createContext, useContext, useEffect, useState } from "react";
import { PlugLogin, StoicLogin, NFIDLogin, IdentityLogin } from "ic-auth";
import { createActor } from "../../../declarations/claimlink_backend";
import { Principal } from "@dfinity/principal";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

const canisterID = process.env.CANISTER_ID_CLAIMLINK_BACKEND;
const whitelist = [process.env.CANISTER_ID_CLAIMLINK_BACKEND];

export const useAuthClient = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [principal, setPrincipal] = useState(null);
  const [backendActor, setBackendActor] = useState(createActor(canisterID));
  const [identity, setIdentity] = useState(null);

  // Save state to sessionStorage
  const saveAuthState = (userObject) => {
    const expirationTime = Date.now() + 1000 * 60 * 60 * 24;
    sessionStorage.setItem("isAuthenticated", true);
    sessionStorage.setItem("principal", userObject.principal);
    sessionStorage.setItem("identity", JSON.stringify(userObject.agent));
    sessionStorage.setItem("expirationTime", expirationTime.toString());
  };

  // Load state from sessionStorage
  const loadAuthState = () => {
    const savedIsAuthenticated =
      sessionStorage.getItem("isAuthenticated") === "true";
    const savedPrincipal = sessionStorage.getItem("principal");
    const savedIdentity = sessionStorage.getItem("identity");
    const expirationTime = sessionStorage.getItem("expirationTime");

    if (expirationTime && Date.now() > Number(expirationTime)) {
      clearAuthState(); // Clear if expired
    } else if (savedIsAuthenticated && savedPrincipal && savedIdentity) {
      setIsAuthenticated(true);
      setPrincipal(Principal.fromText(savedPrincipal));
      setIdentity(JSON.parse(savedIdentity));
    }
  };

  // Clear state from sessionStorage
  const clearAuthState = () => {
    sessionStorage.removeItem("isAuthenticated");
    sessionStorage.removeItem("principal");
    sessionStorage.removeItem("identity");
    sessionStorage.removeItem("expirationTime");
  };

  // Login
  const login = async (provider) => {
    let userObject = {
      principal: "Not Connected.",
      agent: undefined,
      provider: "N/A",
    };
    // if (provider === "Plug") {
    //   userObject = await PlugLogin(whitelist);
    // } else
    if (provider === "Stoic") {
      userObject = await StoicLogin();
    } else if (provider === "NFID") {
      userObject = await NFIDLogin();
    } else if (provider === "Identity") {
      userObject = await IdentityLogin();
    }
    setIsAuthenticated(true);
    setPrincipal(Principal.fromText(userObject.principal));
    setIdentity(userObject.agent);

    // Save to sessionStorage
    saveAuthState(userObject);
  };

  // Logout
  const logout = () => {
    setIsAuthenticated(false);
    setPrincipal(null);
    setIdentity(null);

    // Clear from sessionStorage
    clearAuthState();
  };

  // Init auth
  const initAuthClient = async () => {
    loadAuthState();
  };

  useEffect(() => {
    initAuthClient();
  }, []);

  useEffect(() => {
    // Set logout after 24 hours
    if (isAuthenticated) {
      const logoutTimer = setTimeout(logout, 1000 * 60 * 60 * 24);
      return () => clearTimeout(logoutTimer);
    }
  }, [isAuthenticated]);

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
