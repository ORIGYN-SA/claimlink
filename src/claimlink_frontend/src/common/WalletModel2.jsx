import React, { useEffect } from "react";
import { RxCross1 } from "react-icons/rx";
import { useAuth } from "../connect/useClient";
import { ConnectWallet } from "@nfid/identitykit/react";
import { TbSquareRoundedArrowRightFilled } from "react-icons/tb";

const WalletModal2 = ({ isOpen, onClose }) => {
  const { login, isConnected } = useAuth();

  // Automatically close modal if wallet is connected
  useEffect(() => {
    if (isConnected && onClose) {
      onClose();
    }
  }, [isConnected, onClose]);

  if (!isOpen) return null; // Don't render if modal is closed

  return (
    <div className="fixed inset-0 z-50 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div className="bg-white rounded p-4 w-96">
        <div className="flex  justify-between items-center">
          <h2 className="text-2xl font-bold text-center text-[#4a4a4a] mb-2">
            Connect Your Wallet
          </h2>

          <button
            className="bg-[#5542F6] p-2 rounded-md text-white text-sm font-medium"
            onClick={onClose}
          >
            <RxCross1 />
          </button>
        </div>
        <p className="flex items-center mb-2 gap-2">
          {" "}
          <TbSquareRoundedArrowRightFilled className="w-8  h-8 text-[#5542F6]" />
          Please connect your wallet first. <br />
        </p>

        <p className="flex items-center gap-2">
          {" "}
          <TbSquareRoundedArrowRightFilled className="w-8  h-8 text-[#5542F6]" />
          Select your preferred wallet to get started.
        </p>
        <div className="flex flex-col py-4 gap-4">
          <ConnectWallet
            connectButtonComponent={ConnectBtn}
            className="rounded-full bg-black"
          />
        </div>
      </div>
    </div>
  );
};

export default WalletModal2;

const ConnectBtn = ({ onClick }) => (
  <button
    onClick={onClick}
    className="w-full mt-6 bg-[#5542F6] text-white py-4 font-semibold rounded-xl transition duration-200"
  >
    Sign in
  </button>
);
