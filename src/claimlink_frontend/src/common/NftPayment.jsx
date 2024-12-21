import React, { useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { toast } from "react-hot-toast";
import { Button } from "@headlessui/react";
import { Principal } from "@dfinity/principal";
import { AccountIdentifier } from "@dfinity/ledger-icp";
import { fromHexString } from "@dfinity/candid";
import { Actor } from "@dfinity/agent";
import { idlFactory } from "./Ledger.did";
import plug from "../assets/img/plug.png";
import nfid from "../assets/img/nfid.png";
import { useAgent } from "@nfid/identitykit/react"; // Adjust the hook import if needed
import { useAuth } from "../connect/useClient";

const coffeeAmount = 0.0001 * 100000000; // 0.04 ICP in e8s

const NftPayment = ({ img, toggleModal, name, handlecreate }) => {
  const [message, setMessage] = useState("Pay Now");
  const [loadingPlug, setLoadingPlug] = useState(false);
  const [loadingNfid, setLoadingNfid] = useState(false);
  const [InsufficientFunds, setInsufficientFunds] = useState(false);

  const {
    identity,
    principal,
    connectWallet,
    disconnect,
    isConnected,
    balance,
    wallet,
    backend,
  } = useAuth();
  useEffect(() => {
    if (balance < coffeeAmount / 100000000) {
      setInsufficientFunds(true);
    }
  }, [balance, isConnected]);
  const authenticatedAgent = useAgent();
  const actor = Actor.createActor(idlFactory, {
    agent: authenticatedAgent,
    canisterId: "ryjl3-tyaaa-aaaaa-aaaba-cai",
  });

  // Handle Plug Payment
  const handlePayment = async () => {
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

        if (transfer?.height && typeof transfer.height.height === "number") {
          setMessage(`Transferred ${coffeeAmount} e8s`);
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
    }
  };

  // Handle NFID Payment
  const handleNFidPayment = async () => {
    setLoadingNfid(true);

    const address = AccountIdentifier.fromPrincipal({
      principal: Principal.fromText(
        "oavgn-aq63y-4ppgd-ws735-bqrrn-xdhtc-m3azu-6qga7-i4phr-c7nie-wqe"
      ),
    }).toHex();

    const transferArgs = {
      to: fromHexString(address),
      fee: { e8s: BigInt(10000) },
      memo: BigInt(0),
      from_subaccount: [],
      created_at_time: [],
      amount: { e8s: BigInt(coffeeAmount) },
    };

    try {
      const response = await actor.transfer(transferArgs);
      console.log("Transfer Response:", response);

      if (response && response.Ok) {
        toast.success("Payment successful!");
        handlecreate();
        toggleModal();
      } else if (response.Err.InsufficientFunds.balance.e8s == 0) {
        setPaymentStatus(`Payment failed: ${response.Err}`);
        toast.error("Insufficient Funds");
      } else {
        toast.error("Payment failed: Undefined response.");
      }
    } catch (error) {
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
          <p className="text-xl text-black py-4">Token Name: {name}</p>
          <img src={img} className="w-32" alt="Collection Image" />
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center mt-4 rounded-md px-4 py-2">
            <p className="font-bold">Price: {coffeeAmount / 100000000} ICP</p>
          </div>
          {InsufficientFunds ? (
            <Button
              className="border border-[#5442f6e7] text-black items-center flex font-semibold gap-1 px-2 py-2 rounded-md mt-4"
              onClick={() => {
                toast.error("Insufficient Funds");
              }}
            >
              Make Payment
            </Button>
          ) : wallet === "nfidw" ? (
            <Button
              className="border border-[#5442f6e7] text-black items-center flex font-semibold gap-1 px-2 py-2 rounded-md mt-4"
              onClick={handleNFidPayment}
              disabled={loadingNfid}
            >
              <img src={nfid} alt="NFID" className="w-20 h-8" />
              {loadingNfid ? "Processing..." : message}
            </Button>
          ) : wallet === "plug" ? (
            <Button
              className="border border-[#5442f6e7] text-black items-center flex font-semibold gap-1 px-2 py-2 rounded-md mt-4"
              onClick={handlePayment}
              disabled={loadingPlug}
            >
              <img src={plug} alt="Plug" className="w-8 h-8" />
              {loadingPlug ? "Processing..." : message}
            </Button>
          ) : wallet === "sometingwrong" ? (
            <Button
              className="border border-[#5442f6e7] text-black items-center flex font-semibold gap-1 px-2 py-2 rounded-md mt-4"
              onClick={() => {
                toast.error(" please reConnect wallet");
              }}
            >
              Make Payment
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default NftPayment;
