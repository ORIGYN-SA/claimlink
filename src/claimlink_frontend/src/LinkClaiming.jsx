import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "./connect/useClient";
import { RxCross2 } from "react-icons/rx";
import { useParams, useLocation } from "react-router-dom";
import { Principal } from "@dfinity/principal";

const LinkClaiming = ({}) => {
  const navigate = useNavigate();
  const { identity, backend, principal, connectWallet, isConnected } =
    useAuth();
  const location = useLocation();
  const pathParts = location.pathname.split("/");
  const canisterId = pathParts[2];
  const nftIndex = pathParts[3];
  console.log("object", canisterId, nftIndex);
  useEffect(() => {
    console.log("Canister ID:", canisterId);
    console.log("NFT Index:", nftIndex);
  }, [canisterId, nftIndex]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isConnected) {
      toast.error("Please connect your wallet to claim the NFT.");
    }
  }, [isConnected]);

  const handleClaim = async () => {
    if (!isConnected) {
      toast.error("You need to connect your wallet first.");
      connectWallet();
      return;
    }

    setLoading(true);
    try {
      const canister = Principal.fromText(canisterId);
      const res = await backend?.claimLink(canister, Number(nftIndex));
      console.log("res of clim", res);
      if (res == 0) {
        toast.success("NFT claimed successfully!");
        navigate("/");
      } else {
        toast.error("Failed to claim the NFT.");
      }
    } catch (error) {
      console.error("Error claiming NFT:", error);
      toast.error("Error claiming NFT.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-transparent">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: 1,
          opacity: 1,
          transition: { ease: "easeInOut", duration: 0.4 },
        }}
        className="filter-card px-6 py-4 bg-white rounded-xl w-[400px] h-[260px]"
      >
        <div className="flex flex-col mt-2">
          <div className="flex justify-between gap-4">
            <h1 className=" text-2xl font-medium">Claim Your NFT</h1>
            <button
              className="bg-[#F5F4F7] p-2 rounded-md"
              onClick={() => navigate(-1)}
            >
              <RxCross2 className="text-gray-800 w-5 h-5" />
            </button>
          </div>
          <p className="text-gray-500 text-sm mt-2">
            Click the button below to claim your NFT.
          </p>

          <div className="mt-4 flex justify-center">
            <button
              onClick={handleClaim}
              disabled={loading}
              className={`button px-4 py-2 rounded-md text-white ${
                loading ? "bg-gray-500" : "bg-[#564BF1]"
              }`}
            >
              {loading ? "Claiming..." : "Claim NFT"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LinkClaiming;
