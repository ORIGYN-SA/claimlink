import React, { createContext, useContext, useEffect, useState } from "react";
import { createActor } from "../../../declarations/claimlink_backend";
import { useIdentityKit } from "@nfid/identitykit/react";
import { idlFactory } from "../../../declarations/claimlink_backend/claimlink_backend.did.js";

// Create the authentication context
const AuthContext = createContext();

// Canister ID and whitelist
const canisterID = process.env.CANISTER_ID_CLAIMLINK_BACKEND;
const whitelist = [process.env.CANISTER_ID_CLAIMLINK_BACKEND];

// Custom hook to manage the auth client using NFID identitykit
export const useAuthClient = () => {
  const [isConnected, setIsConnected] = useState(false);

  // NFID identity kit states and hooks
  const {
    user, // The currently logged-in user
    identity, // User identity
    connect, // Function to trigger wallet connection
    disconnect, // Function to handle wallet disconnection
    isInitializing, // Boolean to check if initialization is in progress
  } = useIdentityKit();

  // Effect to track if the user is connected
  useEffect(() => {
    if (user) {
      setIsConnected(true);
    } else {
      setIsConnected(false);
    }
  }, [user]);

  // Return the authentication state and handlers
  return {
    isConnected,
    login: connect, // Login function
    logout: disconnect, // Logout function
    principal: user?.principal, // User's principal
    backend: createActor(canisterID, {
      agentOptions: { identity, verifyQuerySignatures: false },
    }), // Create backend actor using user identity
    identity,
  };
};

// Authentication provider to wrap the app
export const AuthProvider = ({ children }) => {
  const auth = useAuthClient();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

// Hook to use the authentication state in components
export const useAuth = () => useContext(AuthContext);
