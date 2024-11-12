import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AiOutlineLink } from "react-icons/ai";
import { MdArrowOutward, MdDashboard, MdQrCode, MdMoney } from "react-icons/md";
import { RiStackFill } from "react-icons/ri";
import { IoLogOutOutline } from "react-icons/io5";
import { RxCross2, RxHamburgerMenu } from "react-icons/rx";
import test from "../assets/img/test5.png";
import bg1 from "../assets/img/bg1.jpeg";
import bg2 from "../assets/img/bg3.gif";
import bg3 from "../assets/img/bg3.gif";
import bg5 from "../assets/img/test8.gif";
import bgmain1 from "../assets/img/mainbg1.png";
import bgmain2 from "../assets/img/mainbg2.png";
import { GoArrowRight } from "react-icons/go";
import { PiTelegramLogoThin } from "react-icons/pi";
import { CiTwitter } from "react-icons/ci";
import { SlSocialInstagram } from "react-icons/sl";
import { useAuth } from "../connect/useClient";
import CommonModal from "../common/CommonModel";
import Footer from "../common/Footer";

const MainHome = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // const { backend, principal, connectWallet, disconnect, isConnected } =
  //   useAuth();
  // useEffect(() => {
  //   if (!isConnected && !principal) {
  //     navigate("/login");
  //   }
  // }, [isConnected]);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const menuItems = [
    { path: "/", label: "Products" },
    { path: "/sdk", label: "SDK" },
    { path: "/blog", label: "Blog" },
    { path: "/contact-us", label: "Contact us" },
  ];
  const navigate = useNavigate();

  const lunch = () => {
    navigate("/login");
  };

  const generateRandomNumber = () => Math.floor(Math.random() * 1000000);
  const number1 = generateRandomNumber();
  useEffect(() => {
    let sessionNumber = sessionStorage.getItem("sessionNumber");

    if (!sessionNumber) {
      sessionNumber = generateRandomNumber();
      sessionStorage.setItem("sessionNumber", sessionNumber);
    }

    const localvalue = 10;
    console.log("Session random number:", localvalue);

    const previousSessionNumber = localvalue;

    const handleSessionChange = () => {
      const currentSessionNumber = sessionStorage.getItem("sessionNumber");
      if (currentSessionNumber !== previousSessionNumber) {
        localStorage.removeItem("connected");
      }
    };

    const interval = setInterval(handleSessionChange, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [number1]);
  return (
    <>
      <div className="flex flex-col bg-gray-50 ">
        {window.innerWidth < 640 ? (
          <>
            <header className=" w-full bg-[#FBFAFC] h-[88px] border-b border-gray-300 p-6 flex justify-between items-center">
              <div className="text-4xl font-quicksand tracking-wide text-[#2E2C34] flex items-center">
                claimlink
                <MdArrowOutward className="bg-[#3B00B9] rounded text-white ml-2" />
              </div>
              {/* {isSidebarOpen ? (
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
              )} */}
            </header>
            {isSidebarOpen && (
              <Navbar
                setSidebarOpen={toggleSidebar}
                isSidebarOpen={isSidebarOpen}
              />
            )}
          </>
        ) : (
          <header className="hidden md:flex w-full bg-[#FBFAFC] h-[88px] border-b border-gray-300 px-12 py-6 justify-between items-center">
            <div className="text-4xl font-quicksand tracking-wide text-[#2E2C34] flex items-center">
              claimlink
              <MdArrowOutward className="bg-[#3B00B9] rounded text-white ml-2" />
            </div>
            {/* <div>
              <div>
                {menuItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`text-xl py-2 px-6 rounded transition duration-200 ${
                      currentPath === item.path
                        ? "underline text-[#878097]"
                        : "text-[#878097]"
                    } hover:underline`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div> */}
            <div>
              <button
                onClick={lunch}
                className="bg-[#564BF1] py-2 px-6 text-base text-white rounded-md"
              >
                Launch App
              </button>
            </div>
          </header>
        )}
      </div>
      <Home />
    </>
  );
};

export default MainHome;

const Navbar = ({ setSidebarOpen, isSidebarOpen }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const location = useLocation();
  const currentPath = location.pathname;

  const menuItems = [
    { path: "/", label: "Products" },
    { path: "/sdk", label: "SDK" },
    { path: "/blog", label: "Blog" },
    { path: "/contact-us", label: "Contact us" },
  ];

  return (
    <div
      className={`fixed top-0 left-0 w-screen h-screen bg-[#FBFAFC] z-20 flex flex-col transition-transform duration-500 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <header className="w-full bg-[#FBFAFC] h-[88px] border-b border-gray-300 p-6 flex justify-between items-center">
        <div className="text-4xl font-quicksand tracking-wide text-[#2E2C34] flex items-center">
          claimlink
          <MdArrowOutward className="bg-[#3B00B9] rounded text-white ml-2" />
        </div>
        <button
          onClick={setSidebarOpen}
          className="text-xl bg-[#3B00B9] p-2 rounded-md"
        >
          <RxCross2 className="text-white" />
        </button>
      </header>

      <div className="border-t mb-6 border-gray-300"></div>
      {/* <div className="px-4 flex flex-col space-y-4">
        {menuItems.map((item) => (
          <Link
            onClick={setSidebarOpen}
            key={item.path}
            to={item.path}
            className={`flex items-center text-lg tracking-wide font-semibold gap-2 py-3 px-2 rounded transition duration-200 ${
              currentPath === item.path
                ? "bg-[#dad6f797] text-[#5542F6]"
                : "text-[#878097]"
            } hover:bg-[#b8b2ea97]`}
          >
            {item.label}
          </Link>
        ))}
      </div> */}
    </div>
  );
};

const Home = () => {
  const navigate = useNavigate();
  const { backend, principal, connectWallet, disconnect, isConnected } =
    useAuth();
  const lunch = () => {
    navigate("/login");
  };
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = (e) => {
    e.preventDefault();
    setIsModalOpen(!isModalOpen);
  };
  return (
    <>
      <div
        className="flex h-[90vh] bg-white justify-between w-full relative"
        style={{
          top: "0px",
        }}
      >
        <div
          className="absolute inset-0 bg-black opacity-10 z-0"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.0)",
          }}
        ></div>
        <div className=" h-screen w-[300px]  hidden md:block overflow-hidden z-10">
          <img
            src={bgmain1}
            alt=""
            className="transition-transform duration-300  h-[90vh] transform hover:scale-105 ease-in"
          />
        </div>
        <div className="relative md:w-3/5 w-full bg-white flex items-center  justify-center z-10">
          <div className="w-full text-center">
            <h1 className="text-4xl lg:text-6xl font-semibold p-6">
              Send tokens to anyone through a claim link
            </h1>
            <p className="text-base lg:text-lg px-6 py-2">
              Tools to deliver tokens and NFTs to anyone, even for those who
              don’t have a crypto wallet yet
            </p>
            <div className="flex gap-4 lg:gap-6 justify-center px-6 py-4">
              <button
                onClick={lunch}
                className="bg-[#564BF1] py-3 px-6 text-base text-white rounded-md"
              >
                Launch App
              </button>
              {/* {isConnected ? (
                <Link
                  to={"/contact-us"}
                  className="bg-transparent border border-gray-300 py-3 px-6 text-base text-black rounded-md"
                >
                  Contact us
                </Link>
              ) : (
                <Link
                  to={"/login"}
                  className="bg-transparent border border-gray-300 py-3 px-6 text-base text-black rounded-md"
                >
                  Contact us
                </Link>
              )} */}
              <button
                onClick={toggleModal}
                className="bg-transparent border border-gray-300 py-3 px-6 text-base text-black rounded-md"
              >
                Contact us
              </button>
              {isModalOpen && (
                <>
                  <div
                    className="fixed inset-0 bg-[#7979792e] z-50"
                    onClick={toggleModal}
                  ></div>
                  <div className="fixed inset-0 flex items-center justify-center z-50">
                    <CommonModal
                      toggleModal={toggleModal}
                      title="Transfer NFT"
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="  hidden md:block h-screen overflow-hidden  ">
          <img
            src={bgmain2}
            alt=""
            className="transition-transform w-[300px] h-[90vh] duration-300 transform hover:scale-105 ease-in"
          />
        </div>
      </div>
      <Footer />
      {/* <div className="bg-white p-6">
        <h4 className="text-center text-xl text-black">TRUSTED BY</h4>
        <div className="overflow-hidden relative">
          <div className="flex animate-scroll gap-6">
            <div className="flex-shrink-0">
              <img className="h-32 w-32" src={test} alt="" />
            </div>
            <div className="flex-shrink-0">
              <img className="h-32 w-32" src={test} alt="" />
            </div>
            <div className="flex-shrink-0">
              <img className="h-32 w-32" src={test} alt="" />
            </div>
            <div className="flex-shrink-0">
              <img className="h-32 w-32" src={test} alt="" />
            </div>
            <div className="flex-shrink-0">
              <img className="h-32 w-32" src={test} alt="" />
            </div>
            <div className="flex-shrink-0">
              <img className="h-32 w-32" src={test} alt="" />
            </div>
            <div className="flex-shrink-0">
              <img className="h-32 w-32" src={test} alt="" />
            </div>
            <div className="flex-shrink-0">
              <img className="h-32 w-32" src={test} alt="" />
            </div>
            <div className="flex-shrink-0">
              <img className="h-32 w-32" src={test} alt="" />
            </div>
            <div className="flex-shrink-0">
              <img className="h-32 w-32" src={test} alt="" />
            </div>
            <div className="flex-shrink-0">
              <img className="h-32 w-32" src={test} alt="" />
            </div>
            <div className="flex-shrink-0">
              <img className="h-32 w-32" src={test} alt="" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-100 p-6">
        <h2 className="text-2xl font-semibold mx-6 lg:mx-20 my-6">
          Our Product
        </h2>
        <div className="flex flex-col lg:flex-col gap-6 mx-6 lg:mx-20">
          <div className="bg-white py-1 px-12 rounded-2xl flex justify-between items-center">
            <div className="w-1/2">
              {" "}
              <img className="h-48 w-48 lg:h-96 lg:w-96" src={test} alt="" />
            </div>{" "}
            <div className="w-1/2">
              <h2 className="text-2xl font-semibold p-6 text-center">
                Linkdrop Dashboard
              </h2>
              <p className="text-center px-4 lg:px-8">
                Create multiple claim links or QR codes in bulk for your
                marketing campaigns
              </p>
              <div className="flex gap-4 lg:gap-6 px-6 py-4 mt-4 justify-center">
                <button className="bg-[#564BF1] py-3 px-6 text-base text-white rounded-md">
                  Claim demo NFT{" "}
                </button>
                <button className="bg-transparent border border-gray-300 py-3 px-6 text-base text-black rounded-md">
                  Contact us{" "}
                </button>
              </div>
              <p className="text-center mt-10 px-4 lg:px-8">
                Used by 50+ web3 companies
              </p>
            </div>
          </div>
          <div className="bg-white py-1 px-12 rounded-2xl flex justify-between items-center">
            <div className="w-1/2">
              {" "}
              <img className="h-48 w-48 lg:h-96 lg:w-96" src={test} alt="" />
            </div>{" "}
            <div className="w-1/2">
              <h2 className="text-2xl font-semibold p-6 text-center">
                Linkdrop Dashboard
              </h2>
              <p className="text-center px-4 lg:px-8">
                Create multiple claim links or QR codes in bulk for your
                marketing campaigns
              </p>
              <div className="flex gap-4 lg:gap-6 px-6 py-4 mt-4 justify-center">
                <button className="bg-[#564BF1] py-3 px-6 text-base text-white rounded-md">
                  Claim demo NFT{" "}
                </button>
                <button className="bg-transparent border border-gray-300 py-3 px-6 text-base text-black rounded-md">
                  Contact us{" "}
                </button>
              </div>
              <p className="text-center mt-10 px-4 lg:px-8">
                Used by 50+ web3 companies
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-center px-6 lg:px-12 py-6 bg-black">
        <div className="w-full lg:w-1/2 flex items-center justify-center">
          <img
            src={bg1}
            className="w-64 h-64 lg:w-96 lg:h-80 object-cover"
            alt=""
          />
        </div>
        <div className="bg-black text-white py-6 px-6 lg:px-12 rounded-2xl flex flex-col items-center">
          <h2 className="text-2xl font-bold p-6">Linkdrop SDK</h2>
          <p className="px-6 lg:px-20 font-semibold text-center">
            Create multiple claim links or QR codes in bulk for your marketing
            campaigns
          </p>
          <div className="flex gap-4 lg:gap-6 px-6 py-4">
            <button className="bg-[#564BF1] py-3 px-6 text-base text-white rounded-md">
              Claim demo NFT{" "}
            </button>
            <button className="bg-transparent border border-gray-300 py-3 px-6 text-base text-white rounded-md">
              Contact us{" "}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-gray-100 p-6 w-full">
        <h2 className="text-2xl font-semibold mx-6 lg:mx-20 my-12">
          Featured case studies
        </h2>
        <div className="flex gap-10 mx-6">
          {" "}
          <div className="">
            <div className="px-6 lg:px-10 bg-white">
              <img className="h-64 w-64 " src={test} alt="" />
            </div>
            <div className="mt-6">
              <h2 className="text-2xl font-semibold ">Linkdrop Dashboard</h2>
              <p className="mt-6">
                Create multiple claim links or QR codes in bulk for your
                marketing campaigns
              </p>
              <div className="">
                <button className=" flex items-center gap-3 mt-6 text-base black rounded-md">
                  Learn more <GoArrowRight />
                </button>
              </div>
            </div>
          </div>{" "}
          <div className="">
            <div className="px-6 lg:px-10 bg-white">
              <img className="h-64 w-64 " src={test} alt="" />
            </div>
            <div className="mt-6">
              <h2 className="text-2xl font-semibold ">Linkdrop Dashboard</h2>
              <p className="mt-6">
                Create multiple claim links or QR codes in bulk for your
                marketing campaigns
              </p>
              <div className="">
                <button className=" flex items-center gap-3 mt-6 text-base black rounded-md">
                  Learn more <GoArrowRight />
                </button>
              </div>
            </div>
          </div>{" "}
          <div className="">
            <div className="px-6 lg:px-10 bg-white">
              <img className="h-64 w-64 " src={test} alt="" />
            </div>
            <div className="mt-6">
              <h2 className="text-2xl font-semibold ">Linkdrop Dashboard</h2>
              <p className="mt-6">
                Create multiple claim links or QR codes in bulk for your
                marketing campaigns
              </p>
              <div className="">
                <button className=" flex items-center gap-3 mt-6 text-base black rounded-md">
                  Learn more <GoArrowRight />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-gray-100 px-10 pt-20">
        <h4 className="text-center text-xl mt-20 mb-10 text-black">
          TRUSTED BY
        </h4>
        <div className="flex justify-between gap-6">
          <div className="flex-shrink-0">
            <img className="h-32 w-32" src={test} alt="" />
          </div>
          <div className="flex-shrink-0">
            <img className="h-32 w-32" src={test} alt="" />
          </div>

          <div className="flex-shrink-0">
            <img className="h-32 w-32" src={test} alt="" />
          </div>
          <div className="flex-shrink-0">
            <img className="h-32 w-32" src={test} alt="" />
          </div>
          <div className="flex-shrink-0">
            <img className="h-32 w-32" src={test} alt="" />
          </div>
          <div className="flex-shrink-0">
            <img className="h-32 w-32" src={test} alt="" />
          </div>
          <div className="flex-shrink-0">
            <img className="h-32 w-32" src={test} alt="" />
          </div>
        </div>
      </div>
      <div className="bg-gray-100 px-10 pt-20">
        <div className="w-full  p-6 text-center justify-center">
          <h1 className="text-4xl lg:text-2xl font-semibold p-6">
            Send tokens to anyone through a claim link
          </h1>
          <p className="text-base lg:text-lg px-6 py-2">
            Tools to deliver tokens and NFTs to anyone, even for those who don’t
            have a crypto wallet yet
          </p>
          <div className="flex gap-4 lg:gap-6 justify-center px-6 py-4">
            <button
              onClick={lunch}
              className="bg-[#564BF1] py-3 px-6 text-base text-white rounded-md"
            >
              Claim demo NFT{" "}
            </button>
            <button className="bg-transparent border border-gray-300 py-3 px-6 text-base text-black rounded-md">
              Contact us{" "}
            </button>
          </div>
        </div>
      </div>
      <div className="bg-white px-10 pt-20">
        <div className="flex justify-between items-start">
          <div className="text-4xl font-quicksand tracking-wide text-[#2E2C34] flex items-center">
            claimlink
            <MdArrowOutward className="bg-[#3B00B9] rounded text-white ml-2" />
          </div>
          <div className="flex gap-8 black text-md">
            <div className="flex flex-col gap-3">
              <Link>Linkdrop Dashboard</Link>
              <Link>Linkdrop p2p</Link>
              <Link>Blo</Link>
              <Link>SDK</Link>
              <Link>FAQ</Link>
            </div>
            <div className="flex flex-col gap-3">
              <Link>Support</Link>
              <Link>Terms of Service</Link>
              <Link>Privacy Policy</Link>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-center mt-10">
          <div className="flex justify-center gap-4">
            <PiTelegramLogoThin />
            <CiTwitter />
            <SlSocialInstagram />
          </div>
          <div className="flex justify-center gap-4 mt-2">
            All Right reserved by{" "}
            <div className="text-xl font-quicksand tracking-wide text-[#2E2C34] flex items-center">
              claimlink
              <MdArrowOutward className="bg-[#3B00B9] rounded text-white ml-2" />
            </div>{" "}
          </div>
        </div>
      </div> */}
    </>
  );
};
