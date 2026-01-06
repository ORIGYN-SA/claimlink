import { atom } from "jotai";
import type { AuthState } from "../types/interfaces";

const authStateAtom = atom<AuthState>({
  isConnected: false,
  isInitializing: true, // Start as true, will be updated by AuthStateSync
  principalId: "",
  unauthenticatedAgent: undefined,
  authenticatedAgent: undefined,
  canisters: {},
});

export default authStateAtom;
