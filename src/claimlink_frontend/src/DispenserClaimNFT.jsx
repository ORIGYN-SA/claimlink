import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "./connect/useClient";
import { RxCross2 } from "react-icons/rx";
import { RxAvatar, RxHamburgerMenu } from "react-icons/rx";
import { useLocation } from "react-router-dom";
import { Principal } from "@dfinity/principal";
import WalletModal2 from "./common/WalletModel2";
import { MdArrowOutward, MdOutlineArrowDropDown } from "react-icons/md";
import { ConnectWallet } from "@nfid/identitykit/react";

import bgmain1 from "./assets/img/mainbg1.png";
import bgmain2 from "./assets/img/mainbg2.png";

import { InfinitySpin } from "react-loader-spinner";
import QRCode from "react-qr-code"; // QR code library
import { saveAs } from "file-saver"; // For downloading the QR code
import Confetti from "react-confetti";
import { SlRefresh } from "react-icons/sl";
import { IoMdLogOut } from "react-icons/io";
import { IoLogOutOutline } from "react-icons/io5";
import { BsCopy } from "react-icons/bs";
import { createActor } from "../../declarations/extv2";

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
  const [deposits, setDeposits] = useState([]);
  const width = window.innerWidth || 300;
  const height = window.innerHeight || 200;
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false); // State for QR code modal
  const [principalText, setPrincipalText] = useState("connect wallet");
  const location = useLocation();
  const pathParts = location.pathname.split("/");
  const canisterId = pathParts[2];
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const nftIndex = pathParts[3];
  const currentUrl = window.location.href;
  console.log("url", currentUrl); // Get the current page URL
  const [dispenser, setDispenser] = useState(null);
  const [campaign, setCampaign] = useState([]);
  const [celebrate, setCelebrate] = useState(false);
  const [collectionid, setCollectionId] = useState(null);
  const [collcetionimg, setCollectionImg] = useState(null);
  console.log("canider", canisterId);

  const computeTokenIdentifier = (principal, index) => {
    const padding = Buffer("\x0Atid");
    const array = new Uint8Array([
      ...padding,
      ...principal,
      ...to32bits(index),
    ]);

    return Principal.fromUint8Array(array).toText();
  };

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
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const handleDropdownClick = (e) => {
    e.preventDefault();
    setShowLogout((prev) => !prev);
  };

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
  };
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

  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch dispenser data
        const dispenserData = await backend?.getDispenserDetails(canisterId);
        if (dispenserData && Array.isArray(dispenserData)) {
          setDispenser(dispenserData);
          console.log("Dispenser data:", dispenserData);

          // Check if campaignId exists and is valid
          const campaignId = dispenserData[0]?.campaignId;
          if (campaignId) {
            console.log("Loading campaign data for campaignId:", campaignId);

            // Fetch campaign data using the campaignId
            const campdata = await backend?.getCampaignDetails(campaignId);
            if (campdata && Array.isArray(campdata)) {
              setCampaign(campdata);
              const collectionId = campdata[0]?.collection?.toText();
              setCollectionId(collectionId); // Update collectionId state
              console.log("Campaign data:", campdata, collectionId);

              if (collectionId) {
                const nft = createActor(collectionId, {
                  agentOptions: { identity, verifyQuerySignatures: false },
                });

                // Function to fetch image data
                const fetchimg = async () => {
                  try {
                    const data = await nft.getCollectionDetails();
                    setCollectionImg(data);
                    console.log("img data", data);
                  } catch (error) {
                    console.error("Error in fetching collection image:", error);
                  }
                };

                await fetchimg(); // Wait for image data to be fetched
              }
            } else {
              console.error(
                "No campaign data found for campaignId:",
                campaignId
              );
            }
          } else {
            console.warn("No campaignId found in dispenser data");
          }
        } else {
          console.error("Dispenser data is null, undefined, or not an array");
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    // Only call loadData if backend and canisterId are available
    if (backend && canisterId) {
      loadData();
    }
  }, [backend, canisterId]); // Removed collectionid from dependencies to prevent unnecessary reruns

  const handleClaim = async () => {
    if (!isConnected) {
      login();
      return;
    }

    setLoading(true);
    try {
      const res = await backend.dispenserClaim(canisterId);
      console.log("Response of claim:", res);
      if (res.ok == 0) {
        toast.success("NFT claimed successfully!");
        setCelebrate(true);
        setTimeout(() => {
          toast.success("Redirecting to the Collected NFT page");
          navigate("/collected-nft");
          setCelebrate(false);
        }, 3000);
      } else if (res.err) {
        toast.error(`${res.err}`);
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

  const downloadQRCode = () => {
    const svg = document.getElementById("qr-code");
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        saveAs(blob, "qrcode.png");
      });
    };
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };
  const limitCharacters = (text, charLimit) => {
    if (text.length > charLimit) {
      return text.slice(0, charLimit) + "...";
    }
    return text;
  };
  const fallbackCopy = (text) => {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand("copy");
      toast.success("Link copied to clipboard!"); // Alert to confirm the action
    } catch (err) {
      console.error("Fallback: Oops, unable to copy", err);
      toast.error("Failed to copy link.");
    }
    document.body.removeChild(textarea);
  };
  const handleCopy = (text) => {
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          toast.success("Link copied to clipboard!"); // Optional: Alert to confirm the action
        })
        .catch((err) => {
          console.error(
            "Failed to copy using Clipboard API, using fallback",
            err
          );
          fallbackCopy(text); // Use fallback if Clipboard API fails
        });
    } else {
      fallbackCopy(text); // Use fallback if Clipboard API is not available
    }
  };
  return (
    <div className="md:flex  mx-auto bg-white items-start    min-h-screen  overflow-hidden bg-transparent md:w-5/6   ">
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
              login={login}
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
          <div>
            <div className="text-center text-xl mt-10">
              Total NFT's Left : {campaign?.[0]?.depositIndices?.length}
            </div>
            {collcetionimg ? (
              <div className="flex flex-col justify-center items-center">
                {" "}
                <img
                  width="200px"
                  height="200px"
                  src={collcetionimg[2]}
                  alt="NFT Thumbnail"
                  className="flex items-center justify-center "
                />
              </div>
            ) : null}
            <div className="mt-4 flex justify-center">
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

            {/* QR Code Button */}
            <div className="mt-4 flex gap-4 justify-center">
              <button
                onClick={() => setShowQRModal(true)}
                className="bg-[#564BF1] px-4 py-2 z-20 rounded-md text-white"
              >
                Show QR Code
              </button>
              <p
                className="border flex items-center gap-2 px-4 py-2 z-20 cursor-pointer rounded-md text-[#564BF1]"
                onClick={() => {
                  handleCopy(currentUrl);
                }}
              >
                <BsCopy className="text-[#564BF1] w-4 h-4" />
                Copy Link
              </p>
            </div>
          </div>
          {showQRModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white p-8 rounded-lg">
                <button
                  onClick={() => setShowQRModal(false)}
                  className="bg-[#F5F4F7] p-2 rounded-md mb-4"
                >
                  <RxCross2 className="text-gray-800 w-5 h-5" />
                </button>
                <QRCode id="qr-code" value={currentUrl} size={256} />
                <div className="mt-4 flex justify-center">
                  <button
                    onClick={downloadQRCode}
                    className="bg-[#564BF1] px-4 py-2 rounded-md text-white"
                  >
                    Download QR Code
                  </button>
                </div>
              </div>
            </div>
          )}
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
  login,
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

      <div className="px-6 py-2 mb-6">
        <p className="text-sm text-gray-500">Wallet</p>
        <div className="flex justify-between items-center">
          <p className="text-2xl text-gray-900 font-medium w-44 truncate ">
            {principals}
          </p>
          <button
            className="border px-4 py-1 text-[#F95657] border-[#F95657] flex items-center gap-2"
            onClick={isConnected ? logout : () => login()}
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

export default LinkClaiming;
