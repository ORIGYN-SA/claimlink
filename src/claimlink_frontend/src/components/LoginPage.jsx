import React, { useState, useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { MdArrowOutward } from "react-icons/md";
import { Navigate, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Checkbox } from "@headlessui/react";
import { useAuth } from "../connect/useClient";
import { ConnectWallet } from "@nfid/identitykit/react";

const LoginPage = () => {
  const navigate = useNavigate();
  const { isConnected, login, logout } = useAuth();

  useEffect(() => {
    if (isConnected) {
      navigate("/dashboard");
    }
  }, [isConnected, navigate]);

  const handleLoginClick = async () => {
    try {
      await login();
      if (isConnected) {
        toast.success("Connected successfully.");
      }
    } catch (error) {
      toast.error(`Login failed: ${error.message}`);
    }
  };

  const handleLogoutClick = () => {
    logout();
    toast.success("Logged out successfully.");
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
      {isConnected ? <Navigate to="/dashboard" replace /> : null}
      <p className="text-2xl w-full px-3 absolute top-6 tracking-wide   h-[88px] text-[#2E2C34] font-quicksand gap-1 flex">
        claimlink
        <MdArrowOutward className="bg-[#3B00B9] rounded text-white mt-1" />
      </p>
      <div className="bg-white p-8 rounded-xl shadow-lg  mt-24 ">
        <div
          className="flex justify-center mb-6 cursor-pointer"
          onClick={() => navigate("/")}
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
          <label className="flex items-center justify-center space-x-3">
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
              Sign message to login to the dashboard
            </span>
          </label>
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
              Sign message to store data securely
            </span>
          </label>
        </div>

        {!isConnected ? (
          <ConnectWallet
            connectButtonComponent={ConnectBtn}
            className="rounded-full bg-black"
          />
        ) : (
          <button
            className="w-full mt-6 bg-red-500 text-white py-4 font-semibold rounded-xl transition duration-200"
            onClick={handleLogoutClick}
          >
            Logout
          </button>
        )}
      </div>
    </div>
  );
};

const ConnectBtn = ({ onClick }) => (
  <button
    onClick={onClick}
    className="w-full mt-6 bg-[#5542F6] text-white py-4 font-semibold rounded-xl transition duration-200"
  >
    Sign in
  </button>
);

export default LoginPage;
