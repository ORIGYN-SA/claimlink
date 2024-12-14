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

ReactGA.initialize("G-MFY35FRYXL", {
  gaOptions: {
    anonymizeIp: true,
  },
});

const signers = [NFIDW, Plug];
const canisterID = process.env.CANISTER_ID_CLAIMLINK_BACKEND;
ReactDOM.createRoot(document.getElementById("root")).render(
  <IdentityKitProvider
    signers={signers}
    theme={IdentityKitTheme.SYSTEM}
    authType={IdentityKitAuthType.DELEGATION}
    signerClientOptions={{
      targets: [canisterID],
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
