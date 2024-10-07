import React, { useEffect, useState } from "react";
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
import { IdentityKitAuthType, NFIDW, Plug } from "@nfid/identitykit";
import "@nfid/identitykit/react/styles.css";
import { HttpAgent } from "@dfinity/agent";
import toast from "react-hot-toast";

const nfidw = { ...NFIDW, providerUrl: "https://dev.nfid.one/rpc" };
const signers = [nfidw, Plug];

const RootComponent = () => {
  const { identity } = useIdentityKit();
  const [customAgent, setCustomAgent] = useState(null);

  const canisterID = process.env.CANISTER_ID_CLAIMLINK_BACKEND;

  useEffect(() => {
    if (identity) {
      HttpAgent.create({ identity, host: "https://icp-api.io/" }).then(
        setCustomAgent
      );
    }
  }, [identity]);

  return (
    <IdentityKitProvider
      signers={signers}
      theme={IdentityKitTheme.SYSTEM}
      authType={IdentityKitAuthType.ACCOUNTS}
      agent={customAgent}
      signerClientOptions={{
        targets: [canisterID],
      }}
      onConnectFailure={(e) => {
        toast.error(
          e.message === "Not supported"
            ? "Internet Identity doesn’t support accounts. Switch to delegation."
            : e.message
        );
      }}
      onConnectSuccess={() => {
        toast.success("Connected successfully!");
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
};

ReactDOM.createRoot(document.getElementById("root")).render(<RootComponent />);
