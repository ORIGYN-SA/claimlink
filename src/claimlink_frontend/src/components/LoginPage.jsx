import React, { useState, useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { Checkbox } from "@headlessui/react";
import { MdArrowOutward } from "react-icons/md";
import WalletModal from "../common/WalletModal";
import { login } from "../redux/features/authSlice";
import { useAuth } from "../connect/useClient";

const LoginPage = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const { backend, principal, connectWallet, disconnect, isConnected } =
    useAuth();
  useEffect(() => {
    if (isConnected && principal) {
      navigate("/dashboard");
    }
  }, [isConnected]);

  const handleLoginClick = async () => {
    try {
      // Trigger the login process with the selected provider
      // This example uses "Plug" as the provider; adjust based on your requirements
      await dispatch(login("Plug"));
      setShowModal(false);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <>
      <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
        <p className="text-2xl w-full px-3 absolute top-6 tracking-wide h-[88px] text-[#2E2C34] font-quicksand gap-1 flex">
          claimlink
          <MdArrowOutward className="bg-[#3B00B9] rounded text-white mt-1" />
        </p>
        <div className="bg-white p-8  rounded-xl shadow-lg sm:w-[28%]  mt-24">
          <div
            className="flex justify-center mb-6 cursor-pointer"
            onClick={() => {
              navigate("/");
            }}
          >
            <FaArrowLeft className="text-[#5542F6] text-xl" />
          </div>
          <h1 className="text-2xl font-bold text-center mb-6">
            Welcome to Claimlink
          </h1>
          <div className="flex flex-col space-y-4">
            <label className="flex items-center space-x-3">
              <div className="w-6 h-6 mt-3">
                <Checkbox
                  checked={true}
                  className="group block size-4 rounded border bg-white data-[checked]:bg-[#5542F6]"
                >
                  {/* Checkmark icon */}
                  <svg
                    className="stroke-white opacity-0 group-data-[checked]:opacity-100"
                    viewBox="0 0 14 14"
                    fill="none"
                  >
                    <path
                      d="M3 8L6 11L11 3.5"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Checkbox>
              </div>
              <span className="text-black font-semibold text-xl">
                Connect wallet
              </span>
            </label>
            <label className="flex items-center space-x-3">
              <div className="w-6 h-6">
                <Checkbox
                  checked={true}
                  className="group block size-4 rounded border bg-white data-[checked]:bg-[#5542F6]"
                >
                  {/* Checkmark icon */}
                  <svg
                    className="stroke-white opacity-0 group-data-[checked]:opacity-100"
                    viewBox="0 0 14 14"
                    fill="none"
                  >
                    <path
                      d="M3 8L6 11L11 3.5"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Checkbox>
              </div>
              <span className="text-black font-semibold text-xl">
                Sign message to login to the dashboard
              </span>
            </label>
            <label className="flex items-center space-x-3">
              <div className="w-6 h-6">
                <Checkbox
                  checked={true}
                  className="group block size-4 rounded border bg-white data-[checked]:bg-[#5542F6]"
                >
                  {/* Checkmark icon */}
                  <svg
                    className="stroke-white opacity-0 group-data-[checked]:opacity-100"
                    viewBox="0 0 14 14"
                    fill="none"
                  >
                    <path
                      d="M3 8L6 11L11 3.5"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Checkbox>
              </div>
              <span className="text-black font-semibold text-xl">
                Sign message to store data securely
              </span>
            </label>
          </div>
          <button
            className="w-full mt-6 bg-[#5542F6] text-white py-4 font-semibold rounded-xl transition duration-200"
            onClick={() => setShowModal(true)}
          >
            Sign in
          </button>
        </div>
      </div>
      <WalletModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onLogin={handleLoginClick}
      />
    </>
  );
};

export default LoginPage;
