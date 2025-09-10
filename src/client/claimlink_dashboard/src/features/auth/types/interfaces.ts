import type { IDL } from "@dfinity/candid";

export interface Canisters {
  [canisterName: string]: {
    canisterId: string;
    idlFactory: IDL.InterfaceFactory;
  };
}

export interface AuthState {
  isConnected: boolean;
  isInitializing: boolean;
  principalId: string;
  unauthenticatedAgent: any; // Using any to avoid type conflicts between different Agent implementations
  authenticatedAgent: any; // Using any to avoid type conflicts between different Agent implementations
  canisters: Canisters;
}
