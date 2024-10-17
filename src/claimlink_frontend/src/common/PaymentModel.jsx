import React, { useState } from "react";
import { RxCross2 } from "react-icons/rx";
import MainButton from "./Buttons";
import { toast } from "react-hot-toast";
import { Button } from "@headlessui/react";
const coffeeAmount = 100_000; // 0.04 ICP in e8s
const PaymentModel = ({ img, toggleModal, name, handlecreate }) => {
  const [message, setMessage] = useState("Make Payment");
  const [disabled, setDisabled] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePayment = async (e) => {
    e.target.disabled = true;
    setLoading(true);

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
      handlecreate();
      toggleModal();
    } finally {
      setLoading(false);
      setTimeout(() => {
        e.target.disabled = false;
        setMessage("Make Payment");
      }, 5000);
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
          <div className=" flex   items-center mt-4 rounded-md    px-4 py-2">
            <p className="font-bold">Price: 0.001 ICP</p>
          </div>
          <Button
            className="border  bg-[#5542F6] text-white flex font-semibold gap-2 px-4 py-2 rounded-md mt-4 "
            onClick={handlePayment}
            disabled={disabled || loading}
          >
            {loading ? "Processing..." : message}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModel;

//nfid code
/*
import React, { useState } from "react";
import { RxCross2 } from "react-icons/rx";
import MainButton from "./Buttons";
import { useIdentityKit } from "@nfid/identitykit/react";
import { Actor } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import { useAuth } from "../connect/useClient.jsx";
const coffeeAmount = 1_000_000; // 0.04 ICP in e8s (ICP smallest unit)
import { HttpAgent } from "@dfinity/agent";
import { idlFactory } from "../../../declarations/claimlink_backend/claimlink_backend.did.js";
import { createActor } from "../../../declarations/claimlink_backend";
const PaymentModel = ({ img, toggleModal, name, loading, onClick }) => {
  const [message, setMessage] = useState("Buy me a coffee");
  const [disabled, setDisabled] = useState(false);

  const { backend, principal, connectWallet, disconnect, isConnected } =
    useAuth();
  const agent = "NFID";
  // Helper function to convert Principal to Account Identifier
  const accountIdentifierFromPrincipal = (principal) => {
    console.log(
      "Converting principal to account identifier:",
      principal.toText()
    ); // Debugging the principal
    const principalHex = principal.toText();
    const padding = "00"; // Add padding to convert to AccountIdentifier
    const accountIdentifier = principalHex + padding;
    console.log("Generated account identifier:", accountIdentifier); // Debugging the generated account identifier
    return accountIdentifier;
  };

  // Helper function to convert hex string to Uint8Array
  const fromHexString = (hexString) => {
    console.log("Converting hex string to Uint8Array:", hexString); // Debugging hex string conversion
    return new Uint8Array(
      hexString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16))
    );
  };

  // Function to handle the transfer logic
  const handleTransfer = async (transferArgs) => {
    try {
      // Create an HTTP agent
      const agent = new HttpAgent();

  // In local development, you may need to fetch the root key
  if (process.env.NODE_ENV !== "production") {
    await agent.fetchRootKey(); // Ensure the root key is available for local environments
  }

  // Create the actor
  const actor = createActor(idlFactory, {
    agent,
    canisterId: "bkyz2-fmaaa-aaaaa-qaaaq-cai", // ICP Ledger canister ID
  });
  console.log("actor", actor);
  console.log("Calling transfer method with args:", transferArgs);
  const response = await actor.transfer(transferArgs);
  console.log("Transfer response:", response);
  const transferStatus = response?.status;

  if (transferStatus === "COMPLETED") {
    setMessage(`Transferred ${coffeeAmount.toString()} e8s successfully!`);
  } else if (transferStatus === "PENDING") {
    setMessage("Transfer is pending.");
  } else {
    setMessage("Transfer failed.");
  }
} catch (error) {
  console.error("Transfer failed due to an error:", error);
  setMessage("Transfer failed due to an error.");
}
  };

  // Function to handle payment with NFID
  const onNFIDButtonPress = async (el) => {
    el.target.disabled = true;
    setMessage("Connecting to wallet...");
    console.log("Checking if user is authenticated:", isConnected); // Debugging authentication status

// Check if the user is authenticated with NFID
if (isConnected) {
  try {
    console.log("User is authenticated, proceeding with transfer..."); // Debugging user authentication
    // Set the destination principal
    const destinationPrincipal = Principal.fromText(
      "5gojq-7zyol-kqpfn-vett2-e6at4-2wmg5-wyshc-ptyz3-t7pos-okakd-7qe"
    );
    console.log("Destination principal:", destinationPrincipal.toText()); // Debugging destination principal

    const accountIdentifier =
      accountIdentifierFromPrincipal(destinationPrincipal);
    console.log("Account identifier:", accountIdentifier); // Debugging account identifier

    // Prepare transfer arguments
    const transferArgs = {
      to: fromHexString(accountIdentifier), // Convert hex string to Uint8Array
      fee: { e8s: BigInt(10000) }, // Network fee in e8s
      memo: BigInt(0), // Memo, can be anything or left as 0
      from_subaccount: [], // Optional subaccount
      created_at_time: [], // Optional, leave empty
      amount: { e8s: BigInt(coffeeAmount) }, // Amount in e8s
    };

    console.log("Transfer arguments prepared:", transferArgs); // Debugging transfer arguments
    await handleTransfer(transferArgs); // Perform the transfer
  } catch (error) {
    console.error("Error during transfer setup or execution:", error); // Error handling debug
    setMessage("Error occurred during transfer.");
  }
} else {
  setMessage("Wallet connection was refused");
  console.warn("Wallet connection was refused"); // Wallet refused debug
}

// Re-enable the button after 5 seconds
setTimeout(() => {
  el.target.disabled = false;
  setMessage("Buy me a coffee");
  console.log("Re-enabled the button after timeout."); // Button re-enable debug
}, 5000);
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
          <img src={img} className="w-32" alt="" />
        </div>
        <button
          className="text-black"
          onClick={onNFIDButtonPress}
          disabled={disabled}
          style={{ padding: "10px 20px", fontSize: "18px" }}
        >
          Buy with NFID
        </button>
        <div className="flex justify-between items-center">
          <div className="border border-blue-500 flex gap-2 px-4 py-2 rounded-xl mt-4 text-black">
            <p>Price: 3 ICP</p>
          </div>
          <MainButton
            text="Confirm Payment"
            onClick={onClick}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default PaymentModel;
*/
