import React, { useState } from "react";
import { useAuth } from "../connect/useClient";
import { createActor } from "../../../declarations/icp_ledger_canister";
import { Principal } from "@dfinity/principal";
import { AccountIdentifier } from "@dfinity/ledger-icp";
import { fromHexString } from "@dfinity/candid";
import { Actor } from "@dfinity/agent";
import { useAgent, useIdentityKit } from "@nfid/identitykit/react";
import { idlFactory } from "./Ledger.did";
const NfidPayment = () => {
  const {
    identity,
    principal,
    connectWallet,
    disconnect,
    isConnected,
    backend,
  } = useAuth();

  const [transferStatus, setTransferStatus] = useState(null);
  const authenticatedAgent = useAgent();
  const actor = Actor.createActor(idlFactory, {
    agent: authenticatedAgent,
    canisterId: "ryjl3-tyaaa-aaaaa-aaaba-cai",
  });

  const address = AccountIdentifier.fromPrincipal({
    principal: Principal.fromText(
      "3ubze-5mo3v-w6xnt-ktk36-guxla-xsdcr-527zc-5cflh-v2fgp-ses7x-gqe"
    ),
  }).toHex();
  const transferArgs = {
    to: fromHexString(address),
    fee: { e8s: BigInt(10000) },
    memo: BigInt(0),
    from_subaccount: [],
    created_at_time: [],
    amount: { e8s: BigInt(10000) },
  };

  const handlePayment = async () => {
    try {
      const response = await actor.transfer(transferArgs);
      console.log("Transfer Response:", response);

      if (response && response.Ok) {
        setTransferStatus(`Payment successful! Transaction ID: ${response.Ok}`);
      } else if (response && response.Err) {
        setTransferStatus(`Payment failed: ${response.Err.message}`);
      } else {
        setTransferStatus(
          "Payment failed: Undefined response from the transfer call."
        );
      }
    } catch (error) {
      setTransferStatus("Payment failed. Please try again.");
      console.error("Transfer Error:", error);
    }
  };

  return (
    <div>
      <h1>NFID Payment</h1>
      {!isConnected ? (
        <button onClick={connectWallet}>Connect NFID</button>
      ) : (
        <div>
          <p>Connected as: {principal?.toText()}</p>
          <button onClick={disconnect}>Disconnect</button>
          <button onClick={handlePayment}>Make Payment</button>
          {transferStatus && <p>{transferStatus}</p>}
        </div>
      )}
    </div>
  );
};

export default NfidPayment;
