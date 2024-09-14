import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "./connect/useClient";
import { RxCross2 } from "react-icons/rx";
import { useLocation } from "react-router-dom";
import { Principal } from "@dfinity/principal";
import WalletModal2 from "./common/WalletModel2";
import bgmain1 from "./assets/img/bg123456.png";
import bgmain2 from "./assets/img/bg123456.png";
import { MdArrowOutward } from "react-icons/md";
import { InfinitySpin } from "react-loader-spinner";
import Countdown from "react-countdown";

const DispenserClaimNFT = () => {
  const navigate = useNavigate();
  const {
    identity,
    backend,
    principal,
    connectWallet,
    disconnect,
    isConnected,
  } = useAuth();
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [principalText, setPrincipalText] = useState("connect wallet");
  const location = useLocation();
  const pathParts = location.pathname.split("/");
  const canisterId = pathParts[3];
  const dispenserId = pathParts[1];
  const [nftIndex, setNftIndex] = useState(null);
  const [dispenser, setDispenser] = useState([]);
  const [eventDate, setEventDate] = useState(BigInt(0));
  const [duration, setDuration] = useState(BigInt(0));

  useEffect(() => {
    if (isConnected && principal) {
      setPrincipalText(principal.toText());
    } else {
      setPrincipalText("connect wallet");
      setShowModal(true);
    }
  }, [isConnected, principal]);

  useEffect(() => {
    const getDeposits = async () => {
      try {
        setLoadingData(true);
        const detail = await backend.getAlldepositItemsMap();
        const matchedDeposit = detail.find(
          (data) => data[1]?.collectionCanister.toText() === canisterId
        );
        if (matchedDeposit) {
          setNftIndex(matchedDeposit[0]);
        }
        setDeposits(detail);
      } catch (error) {
        console.error("Error fetching deposits:", error);
      } finally {
        setLoadingData(false);
      }
    };
    getDeposits();
  }, [backend, canisterId]);

  useEffect(() => {
    const loadDispenserData = async () => {
      try {
        setLoading(true);
        const dispenserData = await backend?.getUserDispensers();
        setDispenser(dispenserData);
        const matchedDispenser = dispenserData[0].find(
          (d) => d.id === dispenserId
        );
        if (matchedDispenser) {
          setEventDate(matchedDispenser.startDate);
          setDuration(matchedDispenser.duration);
        }
      } catch (error) {
        console.error("Error loading dispenser data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (backend) {
      loadDispenserData();
    }
  }, [backend, dispenserId]);

  const checkEventStatus = (startDate, duration) => {
    const currentTime = BigInt(new Date().getTime()); // Keep this as BigInt
    const eventStartTime = BigInt(startDate); // Assume startDate is already BigInt
    const eventEndTime = eventStartTime + BigInt(Number(duration) * 60 * 1000); // Convert duration to Number before multiplying

    if (currentTime < eventStartTime) {
      return "upcoming";
    } else if (currentTime >= eventStartTime && currentTime <= eventEndTime) {
      return "ongoing";
    } else {
      return "expired";
    }
  };

  const handleClaim = async () => {
    if (!isConnected) {
      setShowModal(true);
      return;
    }

    const userPrincipal = principal?.toText();
    const matchedDispenser = dispenser[0]?.find((d) => d.id === dispenserId);

    if (matchedDispenser.whitelist?.length > 0) {
      if (matchedDispenser && matchedDispenser.whitelist) {
        const isWhitelisted = matchedDispenser.whitelist.some(
          (whitelistedPrincipal) =>
            whitelistedPrincipal.toText() === userPrincipal
        );

        if (!isWhitelisted) {
          toast.error(
            "You are not in the whitelist and cannot claim this NFT."
          );
          return;
        }
      } else {
        toast.error("Dispenser not found or no whitelist available.");
        return;
      }
    }

    setLoading(true);
    try {
      const canister = Principal.fromText(canisterId);
      const res = await backend.claimToken(canister, Number(nftIndex));
      if (res.ok == 0) {
        toast.success("NFT claimed successfully!");

        // Find next NFT index in the same canister
        const nextNftIndex = deposits.find(
          (data) => data[1]?.collectionCanister.toText() === canisterId
        );
        if (nextNftIndex) {
          setNftIndex(nextNftIndex[0]);
        } else {
          toast.error("No more NFTs available for this canister.");
        }
        window.location.reload();
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
  const renderCountdown = (startDate, duration) => {
    const currentTime = new Date().getTime(); // This is a Number
    const eventStartTime = Number(startDate); // Convert BigInt to Number
    const eventEndTime = eventStartTime + Number(duration) * 60 * 1000;

    const status = checkEventStatus(startDate, duration);

    if (status === "upcoming") {
      return (
        <div className="text-center text-lg font-bold text-black">
          Claiming Starts In:
          <Countdown date={eventStartTime} />
        </div>
      );
    } else if (status === "ongoing") {
      return (
        <div className="text-center text-lg font-bold">
          Time Left to Claim:
          <Countdown date={eventEndTime} />
        </div>
      );
    } else {
      return (
        <div className="text-center text-lg font-bold text-red-500">
          Event Expired
        </div>
      );
    }
  };

  const renderNftDetails = () => {
    if (loadingData) {
      return (
        <div className="my-auto flex justify-center items-start mt-16 text-3xl text-gray-300 animate-pulse">
          <InfinitySpin
            visible={true}
            width="200"
            color="#564BF1"
            ariaLabel="infinity-spin-loading"
            className="flex justify-center"
          />
        </div>
      );
    }

    const matchedDeposit = deposits.find(
      (deposit) => deposit[1].collectionCanister?.toText() === canisterId
    );

    if (!matchedDeposit) {
      return (
        <div className="my-auto mt-16 text-xl text-center text-red-500">
          No NFT found.
        </div>
      );
    }

    return (
      <motion.div
        key={matchedDeposit[1]?.tokenId}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="bg-white px-4 py-4 mt-8 rounded-xl cursor-pointer"
      >
        {renderCountdown(eventDate, duration)}
        <p className="text-xs gray mt-1">
          {new Date(
            Number(matchedDeposit[1]?.timestamp) / 1e6
          ).toLocaleString()}
        </p>
        <div className="border border-gray-200 my-4 w-full"></div>
        <div className="w-full">
          <div className="flex justify-between mt-2">
            <p className="text-xs gray">Token ID</p>
            <p className="text-xs font-semibold">
              {matchedDeposit[1]?.tokenId}
            </p>
          </div>
          <div className="flex justify-between mt-2">
            <p className="text-xs gray">Claim Pattern</p>
            <p className="text-xs font-semibold">
              {matchedDeposit[1]?.claimPattern}
            </p>
          </div>
          <div className="flex justify-between mt-2">
            <p className="text-xs gray">Collection</p>
            <p className="text-xs font-semibold">
              {matchedDeposit[1]?.collectionName}
            </p>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <>
      <div
        className="flex flex-col bg-cover bg-no-repeat min-h-screen text-white justify-center w-full px-4 py-8 bg-center relative"
        style={{
          backgroundImage: `url(${bgmain1}), url(${bgmain2})`,
        }}
      >
        <div className="absolute top-0 right-0 p-4">
          <button
            onClick={disconnect}
            className="text-lg font-bold text-gray-200"
          >
            <RxCross2 size={24} />
          </button>
        </div>

        {renderNftDetails()}
        {isConnected ? (
          checkEventStatus(eventDate, duration) === "ongoing" && (
            <div className="mt-8 flex justify-center">
              <button
                onClick={handleClaim}
                disabled={loading}
                className={`${
                  loading ? "bg-gray-500" : "bg-blue-500 hover:bg-blue-700"
                } text-white font-bold py-2 px-4 rounded-lg`}
              >
                {loading ? "Processing..." : "Claim NFT"}
              </button>
            </div>
          )
        ) : (
          <>
            <WalletModal2
              isOpen={showModal}
              connected={isConnected}
              onClose={() => setShowModal(false)}
              onConnect={() => {
                connectWallet();
                window.location.reload();
              }}
            />
          </>
        )}
      </div>
    </>
  );
};

export default DispenserClaimNFT;

// dispenser dynamiicclaimlink dynamic ,dispenser claim on  different browserr  any one can claim
