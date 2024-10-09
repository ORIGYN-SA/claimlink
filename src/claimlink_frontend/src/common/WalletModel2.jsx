import React, { useEffect } from "react";
import { RxCross1 } from "react-icons/rx";
import { useAuth } from "../connect/useClient";
import { ConnectWallet } from "@nfid/identitykit/react";

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
    <div className="fixed inset-0 z-30 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div className="bg-white rounded p-4 w-96">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Select</h2>
          <button
            className="bg-[#5542F6] p-2 rounded-md text-white text-sm font-medium"
            onClick={onClose}
          >
            <RxCross1 />
          </button>
        </div>
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
