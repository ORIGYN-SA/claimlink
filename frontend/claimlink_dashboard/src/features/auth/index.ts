// Auth feature exports

// UI Components
export { LoginPage } from "./components/login-page";
export { ForgotPasswordPage } from "./components/forgot-password-page";
export { NewPasswordPage } from "./components/new-password-page";
export { WalletConnectionSection } from "./components/wallet-connection-section";
export { IntegratorLoginSection } from "./components/integrator-login-section";
export { LoginFooter } from "./components/login-footer";
export { ConnectWalletButton } from "./components/connect-wallet-button";
export * from "./components/wallet-icons";

// Authentication system
export { AuthGate } from "./components/AuthGate";

export { useAuth } from "./hooks/useAuth";
export type { AuthState, Canisters } from "./types/interfaces";
export type { RouterContext, RouterAuthContext } from "./types/router-context";
export { default as authStateAtom } from "./atoms/atoms";
