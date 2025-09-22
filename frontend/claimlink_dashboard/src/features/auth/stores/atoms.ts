import { atom } from "jotai";
import type { AuthState } from "../types/interfaces";

const authStateAtom = atom<AuthState>({
  isConnected: false,
  isInitializing: false,
  principalId: "",
  unauthenticatedAgent: undefined,
  authenticatedAgent: undefined,
  canisters: {},
});

export default authStateAtom;
