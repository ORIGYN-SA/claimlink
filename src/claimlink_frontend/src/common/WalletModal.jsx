import React from "react";
import { useDispatch } from "react-redux";
import { login } from "../redux/features/authSlice";
import { RxCross1 } from "react-icons/rx";

const WalletModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();

  const handleLogin = (provider) => {
    dispatch(login(provider));
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center ">
      <div className="bg-white rounded p-4 w-96">
        <div className="flex justify-between items-center ">
          <h2 className="text-xl font-bold">Select Wallet</h2>
          <button
            className=" bg-[#5542F6] p-2 rounded-md text-white text-sm font-medium"
            onClick={onClose}
          >
            <RxCross1 />
          </button>
        </div>
        <div className="flex flex-col py-4 gap-4">
          <button
            onClick={() => handleLogin("Plug")}
            className="mt-2 hover:bg-[#5542F6] hover:text-white transition duration-300 py-2 px-8 text-xl font-semibold border border-[#5542F6] "
          >
            Plug Wallet
          </button>
          <button
            onClick={() => handleLogin("Stoic")}
            className="mt-2 hover:bg-[#5542F6] hover:text-white transition duration-300 py-2 px-8 text-xl font-semibold border border-[#5542F6] "
          >
            Stoic Wallet
          </button>
          <button
            onClick={() => handleLogin("NFID")}
            className="mt-2 hover:bg-[#5542F6] hover:text-white transition duration-300 py-2 px-8 text-xl font-semibold border border-[#5542F6] "
          >
            NFID
          </button>
          <button
            onClick={() => handleLogin("Identity")}
            className="mt-2 hover:bg-[#5542F6] hover:text-white transition duration-300 py-2 px-8 text-xl font-semibold border border-[#5542F6] "
          >
            Identity
          </button>
        </div>
      </div>
    </div>
  );
};

export default WalletModal;
