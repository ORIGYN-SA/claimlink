import React, { useState } from "react";
import { RxCross2 } from "react-icons/rx";
import MainButton from "./Buttons";
import { toast } from "react-hot-toast";
import { Button } from "@headlessui/react";
import { Principal } from "@dfinity/principal";
import { AccountIdentifier } from "@dfinity/ledger-icp";
import { fromHexString } from "@dfinity/candid";
import { Actor } from "@dfinity/agent";
import { useAgent, useIdentityKit } from "@nfid/identitykit/react";
import { idlFactory } from "./Ledger.did";
import plug from "../assets/img/plug.png";
import nfid from "../assets/img/nfid.png";
import { useAuth } from "../connect/useClient";

const coffeeAmount = 100_000; // 0.04 ICP in e8s

const PaymentModel = ({ img, toggleModal, name, handlecreate }) => {
  const [message, setMessage] = useState("Pay Now");
  const [disabled, setDisabled] = useState(false);
  const [loadingPlug, setLoadingPlug] = useState(false);
  const [loadingNfid, setLoadingNfid] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("");
  const signerId = localStorage.getItem("signerId");
  const {
    identity,
    principal,
    connectWallet,
    disconnect,
    isConnected,
    backend,
  } = useAuth();
  const handlePlugPayment = async (e) => {
    e.target.disabled = true;
    setLoadingPlug(true);

    try {
      const hasAllowed = await window.ic?.plug?.requestConnect();
      if (hasAllowed) {
        setMessage("Plug wallet is connected");

        const requestTransferArg = {
          to: "7yywi-leri6-n33rr-vskr6-yb4nd-dvj6j-xg2b4-reiw6-dljs7-slclz-2ae", // Replace with actual principal address
          amount: coffeeAmount,
        };

        const transfer = await window.ic?.plug?.requestTransfer(
          requestTransferArg
        );
        console.log("Transfer details:", transfer.height.height);

        if (transfer?.height && typeof transfer?.height.height === "number") {
          setMessage(`Transferred ${coffeeAmount} e8s`);
          setPaymentStatus("Payment successful");
          toast.success("Payment successful!");

          handlecreate();
          toggleModal();
        } else if (transfer.height === null || transfer.height === undefined) {
          setMessage("Transfer is pending...");
          toast.loading("Payment pending...");
        } else {
          setMessage("Payment failed");
          toast.error("Payment failed!");
        }
      } else {
        setMessage("Plug wallet connection was refused");
        toast.error("Connection refused by Plug wallet");
      }
    } catch (error) {
      console.error("Payment error:", error);
      setMessage("Payment failed due to an error");
      toast.error("An error occurred during the payment process");
    } finally {
      setLoadingPlug(false);
      setTimeout(() => {
        e.target.disabled = false;
        setMessage("Make Payment");
      }, 5000);
    }
  };
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

  const handleNFidPayment = async () => {
    setLoadingNfid(true);

    try {
      const response = await actor.transfer(transferArgs);
      console.log("Transfer Response:", response);

      if (response && response.Ok) {
        setPaymentStatus(`Payment successful! Transaction ID: ${response.Ok}`);
        toast.success("Payment successful!");
        handlecreate();
        toggleModal();
      } else if (response.Err.InsufficientFunds.balance.e8s == 0) {
        setPaymentStatus(`Payment failed: ${response.Err}`);
        toast.error("Insufficient Funds");
      } else if (response.Err) {
        setPaymentStatus(`Payment failed: ${response.Err.message}`);
        toast.error("Something went wrong !");
      } else {
        setPaymentStatus(
          "Payment failed: Undefined response from the transfer call."
        );
        toast.error("Payment failed: Undefined response.");
      }
    } catch (error) {
      setPaymentStatus("Payment failed. Please try again.");
      console.error("Transfer Error:", error);
      toast.error("An error occurred during the payment process");
    } finally {
      setLoadingNfid(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-100 bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white max-w-lg w-96 mx-4 p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Payment Details</h2>
          <RxCross2 className="cursor-pointer text-xl" onClick={toggleModal} />
        </div>
        <div className="mb-6 flex flex-col justify-center items-center">
          <p className="text-xl text-black py-4">Collection Name: {name}</p>
          <img src={img} className="w-32" alt="Collection Image" />
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center mt-4 rounded-md px-4 py-2">
            <p className="font-bold">Price: 0.001 ICP</p>
          </div>
          {signerId === "NFIDW" ? (
            <Button
              className="border border-[#5442f6e7] text-black items-center flex font-semibold gap-1 px-2 py-2 rounded-md mt-4"
              onClick={handleNFidPayment}
              disabled={disabled || loadingNfid}
            >
              <img src={nfid} alt="NFID" className="w-20 h-8" />
              {loadingNfid ? "Processing..." : message}
            </Button>
          ) : (
            <Button
              className="border border-[#5442f6e7] text-black items-center flex font-semibold gap-1 px-2 py-2 rounded-md mt-4"
              onClick={handlePlugPayment}
              disabled={disabled || loadingPlug}
            >
              <img src={plug} alt="Plug" className="w-8 h-8" />
              {loadingPlug ? "Processing..." : message}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentModel;
