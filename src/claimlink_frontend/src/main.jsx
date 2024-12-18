import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./redux/app/store";
import { AuthProvider } from "./connect/useClient";
import {
  IdentityKitProvider,
  IdentityKitTheme,
  useIdentityKit,
} from "@nfid/identitykit/react";
import {
  IdentityKitAuthType,
  MockedSigner,
  NFIDW,
  Plug,
  InternetIdentity,
  Stoic,
} from "@nfid/identitykit";
import "@nfid/identitykit/react/styles.css";
import ReactGA from "react-ga4";
import { isMobile } from "react-device-detect";

ReactGA.initialize("G-MFY35FRYXL", {
  gaOptions: {
    anonymizeIp: true,
  },
});
const signers = isMobile ? [NFIDW] : [NFIDW, Plug];

// const signers = [NFIDW, Plug];
const canisterID = process.env.CANISTER_ID_CLAIMLINK_BACKEND;
ReactDOM.createRoot(document.getElementById("root")).render(
  <IdentityKitProvider
    signers={signers}
    theme={IdentityKitTheme.SYSTEM}
    authType={IdentityKitAuthType.DELEGATION}
    signerClientOptions={{
      targets: [canisterID],
      maxTimeToLive: BigInt(7 * 24 * 60 * 60 * 1000 * 1000 * 1000), // 1 week in nanoseconds
      idleOptions: {
        idleTimeout: 4 * 60 * 60 * 1000, // 4 hours in milliseconds
        disableIdle: false, // Enable logout on idle timeout
      },
      keyType: "Ed25519", // Use Ed25519 key type for compatibility
      allowInternetIdentityPinAuthentication: true, // Enable PIN authentication
    }}
  >
    <React.StrictMode>
      <Provider store={store}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </Provider>
    </React.StrictMode>
  </IdentityKitProvider>
);
