import React, { useState } from "react";
import toast from "react-hot-toast";
import { PiWalletBold } from "react-icons/pi";
import {
  ConnectWallet,
  IdentityKitProvider,
  useIdentityKit,
} from "@nfid/identitykit/react";

export default function Nfidlogin() {
  const { user, disconnect } = useIdentityKit();
  console.log("fdfgfdg", useIdentityKit());
  const logoutHandler = () => {
    disconnect();
    toast.success("Logged out successfully.");
  };

  return (
    <IdentityKitProvider
      onConnectSuccess={(user) =>
        toast.success(`Connected as ${user?.principal.toText()}`)
      }
      onConnectFailure={(error) => toast.error("Connection failed")}
      onDisconnect={() => toast.success("Disconnected")}
    >
      <div className="w-full h-screen flex justify-center items-center px-6">
        <div className="w-full md:w-1/2 bg-white/50 backdrop-blur-sm p-2 rounded-2xl border-[1px] shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-10 rounded-xl flex flex-col items-center justify-center">
              {!user ? (
                <>
                  <p className="text-xl md:text-2xl font-bold text-center">
                    Connect Your Wallet!
                  </p>
                  <p className="text-xs text-gray-700 mb-10 text-center">
                    Select the wallet you want to connect below
                  </p>
                  <ConnectWallet
                    connectButtonComponent={ConnectBtn}
                    className="rounded-full bg-black"
                  />
                </>
              ) : (
                <>
                  <p className="text-xl md:text-2xl font-bold text-center">
                    Wallet Connected!
                  </p>
                  <p className="text-xs text-gray-700 mb-10 text-center">
                    Principal ID: {user?.principal?.toText()}
                  </p>
                  <button
                    onClick={logoutHandler}
                    className="w-full rounded-full text-white font-semibold bg-red-600 border border-black px-4 py-2 mb-3"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
            <div className="bg-black p-10 rounded-xl flex items-center justify-center hidden md:block overflow-hidden"></div>
          </div>
        </div>
      </div>
    </IdentityKitProvider>
  );
}

// Custom Connect Button
const ConnectBtn = ({ onClick, ...props }) => {
  return (
    <button
      onClick={onClick}
      className="w-full rounded-full text-white font-semibold bg-black border border-black px-4 py-2 mb-3 flex justify-center items-center gap-1.5"
    >
      <PiWalletBold className="w-5 h-5" /> Connect Your Wallet
    </button>
  );
};
