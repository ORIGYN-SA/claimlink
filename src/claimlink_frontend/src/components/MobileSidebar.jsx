import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AiOutlineLink } from "react-icons/ai";
import { IoIosArrowUp, IoIosCloseCircle } from "react-icons/io";
import { MdArrowOutward, MdDashboard, MdQrCode, MdMoney } from "react-icons/md";
import { RiStackFill } from "react-icons/ri";
import { IoLogOutOutline } from "react-icons/io5";
import { RxCross2, RxHamburgerMenu } from "react-icons/rx";
import { useAuth } from "../connect/useClient";
import { RiNftFill } from "react-icons/ri";

const MobileSidebar = ({ setSidebarOpen, isSidebarOpen }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [isVisible, setIsVisible] = useState(false);
  const { login, isConnected, principal, disconnect, logout } = useAuth();
  const [principals, setPrincipal] = useState("connect wallet");

  const handleLogin = () => {
    if (isConnected) {
      logout();
      navigate("/");
    } else {
      login("NFID");
    }
  };
  useEffect(() => {
    if (isConnected && principal) {
      setPrincipal(principal.toText());
    } else {
      setPrincipal("connect wallet");
    }
  }, [isConnected, principal]);

  const menuItems = [
    { path: "/dashboard", label: "Dashboard", icon: MdDashboard },
    { path: "/claim-link", label: "Claim links", icon: AiOutlineLink },
    { path: "/dispensers", label: "Dispensers", icon: RiStackFill },
    { path: "/qr-manager", label: "QR manager", icon: MdQrCode },
    { path: "/minter", label: "Minter", icon: MdMoney },
    { path: "/collected-nft", label: "Collected Nft", icon: RiNftFill },
  ];

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div
      className={`fixed top-0   left-0 w-screen h-screen bg-[#FBFAFC] z-20 flex flex-col  transition-transform duration-500 ${
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
            onClick={handleLogin}
          >
            <IoLogOutOutline />
            {isConnected ? "Logout" : "Login"}
          </button>
        </div>
      </div>
      <div className="border-t mb-6 border-gray-300"></div>
      <div className="px-4 flex flex-col space-y-4">
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
            <item.icon
              className={`text-lg ${
                currentPath === item.path ? "text-[#5542F6]" : "text-gray-400"
              } hover:text-[#5542F6]`}
            />
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MobileSidebar;

export function MobileFooter() {
  const location = useLocation();
  const [principals, setPrincipal] = useState("connect wallet");
  const currentPath = location.pathname;
  const menuItems = [
    { path: "/", label: "Dashboard", icon: MdDashboard },
    { path: "/claim-link", label: "Claim links", icon: AiOutlineLink },
    { path: "/dispensers", label: "Dispensers", icon: RiStackFill },
    { path: "/qr-manager", label: "QR manager", icon: MdQrCode },
    { path: "/minter", label: "Minter", icon: MdMoney },
    { path: "/collected-nft", label: "Collected Nft", icon: RiNftFill },
  ];
  const { login, principal, isConnected, disconnect, logout } = useAuth();
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  const handleLogin = () => {
    if (isConnected) {
      logout();
      navigate("/");
    } else {
      login("NFID");
    }
  };
  useEffect(() => {
    if (isConnected && principal) {
      setPrincipal(principal.toText());
    } else {
      setPrincipal("connect wallet");
    }
  }, [isConnected, principal]);
  return (
    <div className={` w-full h-full bg-[#EBEAED] flex mt-10  flex-col  `}>
      <div className="px-4 py-4 flex justify-between items-center mt-10">
        <p className="text-4xl font-quicksand tracking-wide text-[#2E2C34] flex items-center">
          claimlink
          <MdArrowOutward className="bg-[#3B00B9] rounded text-white ml-2" />
        </p>
        <button
          onClick={scrollToTop}
          className="p-2 text-white bg-[#3B00B9] rounded-md"
        >
          <IoIosArrowUp className=" text-2xl" />
        </button>
      </div>
      <div className="border-t my-6 border-gray-300"></div>

      {/* <div className="px-6 py-2 flex flex-col">
        <p className="text-sm text-gray-500">Balance</p>
        <p className="text-2xl text-gray-900 font-medium">0 ICP</p>
      </div> */}
      <div className="px-6 py-2 mb-6">
        <p className="text-sm text-gray-500">Wallet</p>
        <div className="flex justify-between items-center">
          <p className="text-2xl text-gray-900 font-medium truncate w-48">
            {principals}
          </p>
          <button
            className="border px-4 py-1 text-[#F95657] border-[#F95657] flex items-center gap-2"
            onClick={handleLogin}
          >
            <IoLogOutOutline />
            {isConnected ? "Logout" : "login"}
          </button>
        </div>
      </div>
      <div className="border-t mb-6 border-gray-300"></div>
      <div className="px-4 flex flex-col space-y-4">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center text-lg tracking-wide font-semibold gap-2 py-3 px-2 rounded transition duration-200 ${
              currentPath === item.path
                ? "bg-[#dad6f797] text-[#5542F6]"
                : "text-[#878097]"
            } hover:bg-[#b8b2ea97]`}
          >
            <item.icon
              className={`text-lg ${
                currentPath === item.path ? "text-[#5542F6]" : "text-gray-400"
              } hover:text-[#5542F6]`}
            />
            {item.label}
          </Link>
        ))}
      </div>
      <div className="border-t mt-6 border-gray-300"></div>

      <div className="flex justify-between text-sm text-[#84818A] py-8 px-6">
        <p>Privacy Policy</p>
        <p>2024. Copyright</p>
      </div>
    </div>
  );
}
