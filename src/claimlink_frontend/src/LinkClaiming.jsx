import React, { useState, useEffect, useRef } from "react";

import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "./connect/useClient";
import { RxAvatar, RxCross2, RxHamburgerMenu } from "react-icons/rx";
import { useLocation } from "react-router-dom";
import { Principal } from "@dfinity/principal";
import WalletModal2 from "./common/WalletModel2";
import bgmain1 from "./assets/img/mainbg1.png";
import bgmain2 from "./assets/img/mainbg2.png";
import { MdArrowOutward, MdOutlineArrowDropDown } from "react-icons/md";
import { InfinitySpin } from "react-loader-spinner";
import Confetti from "react-confetti";
import { createActor } from "../../declarations/extv2";
import { Header } from "./common/Header";
import { ConnectWallet } from "@nfid/identitykit/react";
import { SlRefresh } from "react-icons/sl";
import { IoMdLogOut } from "react-icons/io";
import { IoLogOutOutline } from "react-icons/io5";

const LinkClaiming = () => {
  const navigate = useNavigate();
  const {
    identity,
    backend,
    principal,
    connectWallet,
    logout,
    disconnect,
    login,
    isConnected,
  } = useAuth();
  const [showLogout, setShowLogout] = useState(false);
  const dropdownRef = useRef(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const [deposits, setDeposits] = useState([]);
  const width = window.innerWidth || 300;
  const height = window.innerHeight || 200;
  const [celebrate, setCelebrate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [principalText, setPrincipalText] = useState("connect wallet");
  const location = useLocation();
  const pathParts = location.pathname.split("/");
  const canisterId = pathParts[2];
  const nftIndex = pathParts[3];
  const [allnft, setAllNFt] = useState([]);
  const [storednft, setstorednft] = useState([]);
  const nft = createActor(canisterId, {
    agentOptions: { identity, verifyQuerySignatures: false },
  });
  const currentPath = location.pathname;

  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const handleLogin = () => {
    if (isConnected) {
      logout();
      navigate("/");
    } else {
      login("NFID");
    }
  };

  console.log("nft", nft);
  useEffect(() => {
    console.log("Canister ID:", canisterId);
    console.log("NFT Index:", nftIndex);
  }, [canisterId, nftIndex]);
  useEffect(() => {
    if (isConnected && principal) {
      setPrincipalText(principal.toText());
    } else {
      setPrincipalText("connect wallet");
    }
  }, [isConnected, principal]);

  const handleDropdownClick = (e) => {
    e.preventDefault();
    setShowLogout((prev) => !prev);
  };

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
  };

  useEffect(() => {
    const canister = Principal.fromText(canisterId);
    const getDeposits = async () => {
      try {
        const detail = await backend.getDepositItem(Number(nftIndex));
        const data = await nft.getAllNonFungibleTokenData();
        const stored = await backend.getStoredTokens(canister);

        setDeposits(detail);
        setAllNFt(data);
        setstorednft(stored);
        console.log("Deposits:", detail);
        console.log("all nfts:", data);
        console.log("stored:", stored);
      } catch (error) {
        console.log("Error fetching deposits:", error);
      } finally {
        setLoadingData(false);
      }
    };
    getDeposits();
  }, [backend]);
  const handleClaim = async () => {
    if (!isConnected) {
      login();
      return;
    }

    setLoading(true);
    try {
      const canister = Principal.fromText(canisterId);
      const res = await backend.claim(canister, Number(nftIndex));
      console.log("Response of claim:", res);
      if (res.ok == 0) {
        toast.success("NFT claimed successfully!");
        setTimeout(() => {
          toast.success("Redirecting to Collected NFT page!");
        }, 3000);
        setCelebrate(true);
        setTimeout(() => {
          setCelebrate(false);
          navigate("/collected-nft");
        }, 6000);
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
  const limitCharacters = (text, charLimit) => {
    if (text.length > charLimit) {
      return text.slice(0, charLimit) + "...";
    }
    return text;
  };

  const renderNftDetails = () => {
    if (loadingData) {
      return (
        <div className="my-auto flex justify-center items-center mt-[150px] text-3xl text-gray-300 animate-pulse">
          <InfinitySpin
            visible={true}
            width="200"
            color="#564BF1"
            ariaLabel="infinity-spin-loading"
            className="flex justify-center items-center"
          />
        </div>
      );
    }

    if (deposits?.length == 0) {
      return (
        <div className="my-auto mt-16 text-xl z-40 text-center text-red-500">
          No NFT found <br />
          or
          <br /> NFT already claimed
        </div>
      );
    }

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="bg-white px-2 py-2 mt-8 z-40  rounded-xl cursor-pointer"
      >
        {deposits[0]?.claimPattern == "transfer"
          ? allnft.map((nft, index) =>
              nft[0] == deposits[0]?.tokenId ? (
                <div className="flex flex-col justify-center items-center">
                  {" "}
                  <img
                    width="200px"
                    height="200px"
                    src={nft?.[2]?.nonfungible?.thumbnail}
                    alt="NFT Thumbnail"
                    className="flex items-center justify-center "
                  />
                  <h2 className="text-xl black font-bold mt-5">
                    {nft?.[2]?.nonfungible?.name}
                  </h2>
                </div>
              ) : null
            )
          : storednft[0]?.map((nft, index) =>
              nft[0] == deposits[0]?.tokenId ? (
                <div className="flex flex-col justify-center items-center">
                  {" "}
                  <img
                    width="200px"
                    height="200px"
                    src={nft?.[1]?.nonfungible?.thumbnail}
                    alt="NFT Thumbnail"
                    className="flex items-center justify-center "
                  />
                  <h2 className="text-xl black font-bold mt-5">
                    {nft?.[1]?.nonfungible?.name}
                  </h2>
                </div>
              ) : null
            )}

        <p className="text-xs gray mt-1">
          <p className="text-xs gray mt-1 flex items-center justify-center">
            {new Date(Number(deposits[0]?.timestamp) / 1e6).toLocaleString()}
          </p>
        </p>
        <div className="border border-gray-200 my-4 w-full"></div>
        <div className="w-full">
          <div className="flex justify-between mt-2">
            <p className="text-xs gray">Token ID</p>
            <p className="text-xs font-semibold">{deposits[0]?.tokenId}</p>
          </div>
          <div className="flex justify-between mt-2">
            <p className="text-xs gray">Claim Pattern</p>
            <p className="text-xs font-semibold capitalize">
              {deposits[0]?.claimPattern}
            </p>
          </div>
          <div className="flex justify-between mt-2">
            <p className="text-xs gray">Status</p>
            <p className="text-xs font-semibold capitalize">
              {deposits[0]?.status}
            </p>
          </div>
        </div>
        <div className="border border-gray-200 my-4"></div>
      </motion.div>
    );
  };

  return (
    <div className="md:flex  mx-auto bg-white items-start    min-h-screen  overflow-hidden bg-transparent md:w-5/6   ">
      {/* <div
        className="absolute inset-0 bg-black opacity-10 z-0"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.0)",
        }}
      ></div>
      <div className="h-screen hidden  md:flex overflow-hidden z-10">
        <img
          src={bgmain1}
          alt=""
          className="transition-transform duration-300 w-[300px]  z-20 h-[90vh] transform hover:scale-105 ease-in"
        />

      </div> */}
      {isMobile ? (
        <div className="flex flex-col bg-gray-50 h-full">
          <header className="w-full bg-[#FBFAFC] h-[88px] border-b border-gray-300 p-6 flex justify-between items-center">
            <div className="text-4xl font-quicksand tracking-wide text-[#2E2C34] flex items-center">
              claimlink
              <MdArrowOutward className="bg-[#3B00B9] rounded text-white ml-2" />
            </div>
            {isSidebarOpen ? (
              <button
                onClick={toggleSidebar}
                className="text-xl bg-[#3B00B9] p-2 rounded-md"
              >
                <RxCross2 className="text-white " />{" "}
              </button>
            ) : (
              <button
                onClick={toggleSidebar}
                className="text-xl px-2 py-2 bg-gray-300 rounded-md"
              >
                <RxHamburgerMenu />
              </button>
            )}
          </header>
          {isSidebarOpen && (
            <MobileHeader
              setSidebarOpen={toggleSidebar}
              isSidebarOpen={isSidebarOpen}
              principals={principalText}
              isConnected={isConnected}
              logout={logout}
              setShowModal={setShowModal}
            />
          )}
        </div>
      ) : null}
      <div className="text-4xl hidden  mt-2 font-quicksand py-1 z-40 tracking-wide text-[#2E2C34]  md:flex items-center justify-center md:justify-normal">
        claimlink
        <MdArrowOutward className="bg-[#3B00B9] rounded text-white ml-2" />
      </div>{" "}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: 1,
          opacity: 1,
          transition: { ease: "easeInOut", duration: 0.4 },
        }}
        className="filter-card  rounded-xl w-full "
      >
        {" "}
        <div className="flex flex-col items-center md:w-[400px] justify-center mx-auto md:mt-20     md:h-full  h-screen">
          {isConnected ? (
            <div className="justify-center items-center  gap-4 flex-col z-40">
              <h1 className="text-xl text-center font-medium   px-2  py-1">
                Your NFT Details
              </h1>
            </div>
          ) : (
            <div className="flex justify-center items-center gap-4 flex-col z-40">
              <h1 className="text-xl text-center font-medium line-clamp-2  px-2  py-1">
                Claim your NFT
              </h1>
            </div>
          )}
          {renderNftDetails()}
          {deposits.length > 0 && !loadingData ? (
            <div className="mt-4 flex z-40 justify-center">
              <button
                onClick={handleClaim}
                disabled={loading}
                className={`button px-4 z-20 py-2 rounded-md text-white ${
                  loading ? "bg-gray-500" : "bg-[#564BF1]"
                }`}
              >
                {loading ? "Claiming..." : "Claim NFT"}
              </button>
            </div>
          ) : null}
        </div>
      </motion.div>
      {/* <div className="h-screen hidden  md:flex overflow-hidden w-[300px] z-10">
        <img
          src={bgmain2}
          alt=""
          className="transition-transform h-[90vh] z-20 duration-300 transform hover:scale-105 ease-in"
        />
      </div> */}
      <div className="md:flex  hidden relative   items-center mt-4 font-semibold justify-end">
        <span
          className="flex items-center justify-center text-[#2E2C34] font-Manrope rounded-3xl bg-gray-200 px-3 py-2 cursor-pointer"
          onClick={handleDropdownClick}
        >
          <RxAvatar size={24} className="text-[#5542F6] mr-2" />
          <p className="w-40 truncate font-bold flex items-center overflow-hidden whitespace-nowrap">
            {limitCharacters(principalText, 17)}
          </p>
          <MdOutlineArrowDropDown size={24} className="text-gray-500" />
        </span>
        {showLogout && (
          <div
            ref={dropdownRef}
            className="absolute  top-10 right-2 mt-2 bg-gray-200 z-50 p-2 rounded"
          >
            {isConnected ? (
              <div className="flex flex-col gap-2 z-10">
                <button
                  className="font-xs text-[#2E2C34] flex items-center gap-1 font-semibold px-3 py-2 w-36 hover:bg-gray-50 border border-gray-50"
                  onClick={() => {
                    window.location.reload();
                  }}
                >
                  <SlRefresh />
                  Refresh
                </button>

                <button
                  className="font-xs flex items-center gap-1 text-[#2E2C34] hover:bg-gray-50 border border-gray-50 rounded font-semibold px-3 py-2 w-36"
                  onClick={handleLogout}
                >
                  <IoMdLogOut />
                  Logout
                </button>
              </div>
            ) : (
              <ConnectWallet
                connectButtonComponent={ConnectBtn}
                className="rounded-full bg-black"
              />
            )}
          </div>
        )}
      </div>
      <WalletModal2 isOpen={showModal} onClose={() => setShowModal(false)} />
      {celebrate ? (
        <Confetti className="z-50" width={width} height={height} />
      ) : null}
    </div>
  );
};

export default LinkClaiming;

const ConnectBtn = ({ onClick }) => (
  <button
    onClick={onClick}
    className="font-xs flex items-center gap-1 text-[#2E2C34] hover:bg-gray-50 border border-gray-50 rounded font-semibold px-3 py-2 w-36"
  >
    Sign in
  </button>
);

const MobileHeader = ({
  isConnected,
  toggleSidebar,
  principals,
  handleLogin,
  isSidebarOpen,
  setSidebarOpen,
  logout,
  setShowModal,
}) => {
  useEffect(() => {
    setIsVisible(true);
  }, []);
  const [isVisible, setIsVisible] = useState(false);
  return (
    <div
      className={`fixed top-0   left-0 w-screen h-screen bg-[#ffffff] z-50 flex flex-col  transition-transform duration-500 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <header className="w-full bg-[#FBFAFC] h-[88px] border-b border-gray-300 p-6 flex justify-between items-center">
        <div className="text-4xl font-quicksand tracking-wide text-[#2E2C34] flex items-center">
          claimlink
          <MdArrowOutward className="bg-[#3B00B9] rounded text-white ml-2" />
        </div>
        {isSidebarOpen ? (
          <button
            onClick={setSidebarOpen}
            className="text-xl bg-[#3B00B9] p-2 rounded-md"
          >
            <RxCross2 className="text-white " />{" "}
          </button>
        ) : (
          <button
            onClick={setSidebarOpen}
            className="text-xl px-2 py-2 bg-gray-300 rounded-md"
          >
            <RxHamburgerMenu />
          </button>
        )}
      </header>
      {/* <div className="px-6 py-2 flex flex-col">
      <p className="text-sm text-gray-500">Balance</p>
      <p className="text-2xl text-gray-900 font-medium">0 ICP</p>
    </div> */}
      <div className="px-6 py-2 mb-6">
        <p className="text-sm text-gray-500">Wallet</p>
        <div className="flex justify-between items-center">
          <p className="text-2xl text-gray-900 font-medium w-44 truncate ">
            {principals}
          </p>
          <button
            className="border px-4 py-1 text-[#F95657] border-[#F95657] flex items-center gap-2"
            onClick={isConnected ? logout : () => setShowModal(true)}
          >
            <IoLogOutOutline />
            {isConnected ? "Logout" : "Login"}
          </button>
        </div>
      </div>
      <div className="border-t mb-6 border-gray-300"></div>
      <div className="px-4 flex flex-col space-y-4"></div>
    </div>
  );
};
