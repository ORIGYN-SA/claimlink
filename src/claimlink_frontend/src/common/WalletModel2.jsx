import React from "react";
import { RxCross1 } from "react-icons/rx";
import { useAuth } from "../connect/useClient";
import { useNavigate } from "react-router-dom";
import { ConnectWallet } from "@nfid/identitykit/react";

const WalletModal2 = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const handleLogin = (provider) => {
    login(provider);

    onClose();
  };

  return (
    <div className="fixed inset-0 z-30 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div className="bg-white rounded p-4 w-96">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Select Wallet</h2>
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
