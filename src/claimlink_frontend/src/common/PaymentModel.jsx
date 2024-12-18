// import React, { useEffect, useState } from "react";
// import { RxCross2 } from "react-icons/rx";
// import MainButton from "./Buttons";
// import { toast } from "react-hot-toast";
// import { Button } from "@headlessui/react";
// import { Principal } from "@dfinity/principal";
// import { AccountIdentifier } from "@dfinity/ledger-icp";
// import { fromHexString } from "@dfinity/candid";
// import { Actor } from "@dfinity/agent";
// import { useAgent, useIdentityKit } from "@nfid/identitykit/react";
// import { idlFactory } from "./Ledger.did";
// import plug from "../assets/img/plug.png";
// import nfid from "../assets/img/nfid.png";
// import { useAuth } from "../connect/useClient";
// import { createActor } from "../../../declarations/icp_ledger_canister";

// const coffeeAmount = 0.0001;
// const PaymentModel = ({ img, toggleModal, name, handlecreate }) => {
//   const [message, setMessage] = useState("Pay Now");
//   const [disabled, setDisabled] = useState(false);
//   const [loadingPlug, setLoadingPlug] = useState(false);
//   const [loadingNfid, setLoadingNfid] = useState(false);
//   const [paymentStatus, setPaymentStatus] = useState("");
//   const authenticatedAgent = useAgent();

//   const [InsufficientFunds, setInsufficientFunds] = useState(false);
//   const {
//     identity,
//     principal,
//     connectWallet,
//     disconnect,
//     isConnected,
//     balance,
//     wallet,
//     backend,
//   } = useAuth();
//   // const canisterId = "ryjl3-tyaaa-aaaaa-aaaba-cai";
//   // console.log("balance", balance, coffeeAmount / 100000000);
//   // const ladergercanister = createActor(canisterId, {
//   //   agentOptions: { identity, verifyQuerySignatures: false },
//   // });
//   // console.log("ladger", ladergercanister);

//   useEffect(() => {
//     if (balance < coffeeAmount / 100000000) {
//       setInsufficientFunds(true);
//     }
//   }, [balance]);
//   // const handlePlugPayment = async (e) => {
//   //   e.target.disabled = true;
//   //   setLoadingPlug(true);

//   //   try {
//   //     const hasAllowed = await window.ic?.plug?.requestConnect();
//   //     if (hasAllowed) {
//   //       setMessage("Plug wallet is connected");

//   //       const requestTransferArg = {
//   //         to: "7yywi-leri6-n33rr-vskr6-yb4nd-dvj6j-xg2b4-reiw6-dljs7-slclz-2ae", // Replace with actual principal address
//   //         amount: coffeeAmount,
//   //       };

//   //       const transfer = await window.ic?.plug?.requestTransfer(
//   //         requestTransferArg
//   //       );
//   //       console.log("Transfer details:", transfer.height.height);

//   //       if (transfer?.height && typeof transfer?.height.height === "number") {
//   //         setMessage(`Transferred ${coffeeAmount} e8s`);
//   //         setPaymentStatus("Payment successful");
//   //         toast.success("Payment successful!");

//   //         handlecreate();
//   //         toggleModal();
//   //       } else if (transfer.height === null || transfer.height === undefined) {
//   //         setMessage("Transfer is pending...");
//   //         toast.loading("Payment pending...");
//   //       } else {
//   //         setMessage("Payment failed");
//   //         toast.error("Payment failed!");
//   //       }
//   //     } else {
//   //       setMessage("Plug wallet connection was refused");
//   //       toast.error("Connection refused by Plug wallet");
//   //     }
//   //   } catch (error) {
//   //     console.error("Payment error:", error);
//   //     setMessage("Payment failed due to an error");
//   //     toast.error("An error occurred during the payment process");
//   //   } finally {
//   //     setLoadingPlug(false);
//   //     setTimeout(() => {
//   //       e.target.disabled = false;
//   //       setMessage("Make Payment");
//   //     }, 5000);
//   //   }
//   // };
//   // const actor = Actor.createActor(idlFactory, {
//   //   agent: authenticatedAgent,
//   //   canisterId: "ryjl3-tyaaa-aaaaa-aaaba-cai",
//   // });

//   // const address = AccountIdentifier.fromPrincipal({
//   //   principal: Principal.fromText(
//   //     "oavgn-aq63y-4ppgd-ws735-bqrrn-xdhtc-m3azu-6qga7-i4phr-c7nie-wqe"
//   //   ),
//   // }).toHex();
//   // const transferArgs = {
//   //   to: fromHexString(address),
//   //   fee: { e8s: BigInt(10000) },
//   //   memo: BigInt(0),
//   //   from_subaccount: [],
//   //   created_at_time: [],
//   //   amount: { e8s: BigInt(coffeeAmount) },
//   // };

//   // const handleNFidPayment = async () => {
//   //   setLoadingNfid(true);

//   //   try {
//   //     const response = await ladergercanister.icrc2_approve(icrc2_approve_args);
//   //     console.log("Transfer Response:", response);

//   //     if (response && response.Ok) {
//   //       setPaymentStatus(`Payment successful! Transaction ID: ${response.Ok}`);
//   //       toast.success("Payment successful!");
//   //       handlecreate();
//   //       toggleModal();
//   //     } else if (response.Err.InsufficientFunds.balance.e8s == 0) {
//   //       setPaymentStatus(`Payment failed: ${response.Err}`);
//   //       toast.error("Insufficient Funds");
//   //     } else if (response.Err) {
//   //       setPaymentStatus(`Payment failed: ${response.Err.message}`);
//   //       toast.error("Something went wrong !");
//   //     } else {
//   //       setPaymentStatus(
//   //         "Payment failed: Undefined response from the transfer call."
//   //       );
//   //       toast.error("Payment failed: Undefined response.");
//   //     }
//   //   } catch (error) {
//   //     setPaymentStatus("Payment failed. Please try again.");
//   //     console.error("Transfer Error:", error);
//   //     toast.error("An error occurred during the payment process");
//   //   } finally {
//   //     setLoadingNfid(false);
//   //   }
//   // };

//   useEffect(() => {
//     const paymentProcess = async () => {
//       const actor = Actor.createActor(idlFactory, {
//         agent: authenticatedAgent,
//         canisterId: "ryjl3-tyaaa-aaaaa-aaaba-cai",
//       });

//       // Acc info
//       const acc = {
//         owner: Principal.fromText(
//           "5gojq-7zyol-kqpfn-vett2-e6at4-2wmg5-wyshc-ptyz3-t7pos-okakd-7qe"
//         ),
//         /* owner: Principal.fromText(
//           "oavgn-aq63y-4ppgd-ws735-bqrrn-xdhtc-m3azu-6qga7-i4phr-c7nie-wqe"
//         ), */
//         subaccount: [],
//       };

//       const icrc2_approve_args = {
//         from_subaccount: [],
//         spender: acc,
//         fee: [],
//         memo: [],
//         amount: BigInt(coffeeAmount * 10 ** 8 + 100000),
//         created_at_time: [],
//         expected_allowance: [],
//         expires_at: [],
//       };
//       // console.log(orderPlacementData);
//       //const amount = BigInt(orderPlacementData.totalAmount * 10 ** 8 + 10_000);
//       //const totalamount = 210_000;
//       const totalamount = BigInt(coffeeAmount * 10 ** 8);
//       console.log("totalamount", totalamount);

//       try {
//         const response = await actor.icrc2_approve(icrc2_approve_args);
//         console.log("Response from payment approve", response);
//         try {
//           if (response.Ok) {
//             try {
//               setMessage(`Transferred ${coffeeAmount} e8s`);
//               setPaymentStatus("Payment successful");
//               toast.success("Payment successful!");

//               handlecreate();
//               toggleModal();
//             } catch (err) {
//               console.error("Error in final order", err);
//             }
//           } else {
//             console.error("Payment failed", response);
//             toast.error("Payment failed, Please check your wallet balance");
//           }
//         } catch (err) {
//           console.error("Transaction failed", err);
//           toast.error("Transaction failed");
//         }
//       } catch (err) {
//         console.error("Payment error:", err);
//         setMessage("Payment failed due to an error");
//         toast.error("An error occurred during the payment process");
//       } finally {
//         setLoadingPlug(false);
//         setTimeout(() => {
//           e.target.disabled = false;
//           setMessage("Make Payment");
//         }, 5000);
//       }
//     };
//   }, []);
//   return (
//     <div className="fixed inset-0 bg-gray-100 bg-opacity-60 flex items-center justify-center z-50">
//       <div className="bg-white max-w-lg w-96 mx-4 p-6 rounded-lg shadow-lg">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-xl font-bold">Payment Details</h2>
//           <RxCross2 className="cursor-pointer text-xl" onClick={toggleModal} />
//         </div>
//         <div className="mb-6 flex flex-col justify-center items-center">
//           <p className="text-xl text-black py-4">Collection Name: {name}</p>
//           <img src={img} className="w-32" alt="Collection Image" />
//         </div>

//         <div className="flex justify-between items-center">
//           <div className="flex items-center mt-4 rounded-md px-4 py-2">
//             <p className="font-bold">Price: {coffeeAmount / 100000000} ICP</p>
//           </div>
//           {InsufficientFunds ? (
//             <Button
//               className="border border-[#5442f6e7] text-black items-center flex font-semibold gap-1 px-2 py-2 rounded-md mt-4"
//               onClick={() => {
//                 toast.error("Insufficient Funds");
//               }}
//               disabled={disabled || loadingNfid}
//             >
//               Make Payment
//             </Button>
//           ) : wallet === "nfidw" ? (
//             <Button
//               className="border border-[#5442f6e7] text-black items-center flex font-semibold gap-1 px-2 py-2 rounded-md mt-4"
//               onClick={handleNFidPayment}
//               disabled={disabled || loadingNfid}
//             >
//               <img src={nfid} alt="NFID" className="w-20 h-8" />
//               {loadingNfid ? "Processing..." : message}
//             </Button>
//           ) : wallet === "plug" ? (
//             <Button
//               className="border border-[#5442f6e7] text-black items-center flex font-semibold gap-1 px-2 py-2 rounded-md mt-4"
//               onClick={handlePlugPayment}
//               disabled={disabled || loadingPlug}
//             >
//               <img src={plug} alt="Plug" className="w-8 h-8" />
//               {loadingPlug ? "Processing..." : message}
//             </Button>
//           ) : wallet === "sometingwrong" ? (
//             <Button
//               className="border border-[#5442f6e7] text-black items-center flex font-semibold gap-1 px-2 py-2 rounded-md mt-4"
//               onClick={() => {
//                 toast.error(" please reConnect wallet");
//               }}
//             >
//               Make Payment
//             </Button>
//           ) : null}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PaymentModel;

{
  /* 
signerId === "NFIDW" ? (
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
          )} */
}

import React, { useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { Button } from "@headlessui/react";
import { toast } from "react-hot-toast";
import { useAgent } from "@nfid/identitykit/react";
import { Principal } from "@dfinity/principal";
import plug from "../assets/img/plug.png";
import nfid from "../assets/img/nfid.png";
import { useAuth } from "../connect/useClient";
import { Actor } from "@dfinity/agent";
import { idlFactory } from "../connect/token-icp-ladger";

// const coffeeAmount = 0.0001;
const PaymentModel = ({
  img,
  toggleModal,
  name,
  handlecreate,
  coffeeAmount,
}) => {
  const [message, setMessage] = useState("Pay Now");
  const [loading, setLoading] = useState(false);
  const [insufficientFunds, setInsufficientFunds] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("");
  const authenticatedAgent = useAgent();
  const { balance, wallet, backend } = useAuth();
  const [cycles, setCycles] = useState(null);
  const [insufficientCylces, setinsufficientCylces] = useState(false);

  useEffect(() => {
    if (balance < coffeeAmount / 100000000) {
      setInsufficientFunds(true);
    }
    const fetchcycles = async () => {
      try {
        const data = await backend.availableCycles();
        setCycles(data);
        setinsufficientCylces(Number(data) < 800_510_000_000 ? true : false);
        console.log("cylces available", data, insufficientCylces);
      } catch (error) {
        console.log("eror in cycles", error);
      }
    };
    fetchcycles();
  }, [balance]);

  const handlePayment = async (e) => {
    setLoading(true);

    const actor = Actor.createActor(idlFactory, {
      agent: authenticatedAgent,
      canisterId: "ryjl3-tyaaa-aaaaa-aaaba-cai",
    });
    console.log("actor", actor);
    const transferArgs = {
      from_subaccount: [],
      spender: {
        owner: Principal.fromText("xjhju-3aaaa-aaaak-akv5q-cai"),
        subaccount: [],
      },
      amount: BigInt(coffeeAmount * 10 ** 8 + 10000),
      fee: [],
      memo: [],
      created_at_time: [],
      expected_allowance: [],
      expires_at: [],
    };

    try {
      const response = await actor.icrc2_approve(transferArgs);
      if (response.Ok) {
        console.log("res of paymnet", response);
        setMessage(`Transferred ${coffeeAmount} ICP`);
        setPaymentStatus("Payment successful");
        toast.success("Payment successful!");
        handlecreate();
        toggleModal();
      } else {
        throw new Error(response.Err || "Payment failed");
      }
    } catch (error) {
      setMessage("Payment failed");
      toast.error("Payment failed, please check your wallet balance");
      setPaymentStatus("Payment failed");
      console.error("Payment error:", error);
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
          <p className="font-bold">Price: {coffeeAmount} ICP</p>
          <Button
            className="border border-[#5442f6e7] text-black items-center flex font-semibold gap-1 px-2 py-2 rounded-md mt-4"
            onClick={
              insufficientFunds || insufficientCylces
                ? () => toast.error("Insufficient Funds/cycles")
                : handlePayment
            }
            disabled={loading}
          >
            {wallet === "nfidw" ? (
              <img src={nfid} alt="NFID" className="w-20 h-8" />
            ) : (
              <img src={plug} alt="Plug" className="w-8 h-8" />
            )}
            {loading ? "Processing..." : message}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModel;
