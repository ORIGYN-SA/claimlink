import React, { useState, useEffect, useRef } from "react";
import { BsArrowLeft } from "react-icons/bs";
import { MdOutlineArrowDropDown } from "react-icons/md";
import { RxAvatar, RxHamburgerMenu } from "react-icons/rx";
import { useNavigate } from "react-router-dom";
import WalletModal from "./WalletModal";
import { useAuth } from "../connect/useClient";
import { SlRefresh } from "react-icons/sl";
import { IoMdLogOut } from "react-icons/io";
import { IoCopyOutline } from "react-icons/io5";
import toast from "react-hot-toast";
import logo from "../assets/img/logoicp.png";
import { ConnectWallet } from "@nfid/identitykit/react";
export const Header = ({ htext, menubar, toggleSidebar }) => {
  const modalRef = useRef(null);
  const dropdownRef = useRef(null);

  const navigate = useNavigate();
  const { isConnected, principal, logout, balance } = useAuth();
  const [showLogout, setShowLogout] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [principalText, setPrincipalText] = useState("connect wallet");

  const date = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

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
    navigate("/");
  };

  const handleCopy = (text) => {
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          toast.success("Address copied to clipboard!");
        })
        .catch((err) => {
          console.error(
            "Failed to copy using Clipboard API, using fallback",
            err
          );
          fallbackCopy(text);
        });
    } else {
      fallbackCopy(text);
    }
  };

  const fallbackCopy = (text) => {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand("copy");
      toast.success("Link copied to clipboard!");
    } catch (err) {
      console.error("Fallback: Oops, unable to copy", err);
      toast.error("Failed to copy link.");
    }
    document.body.removeChild(textarea);
  };

  const limitCharacters = (text, charLimit) => {
    if (text.length > charLimit) {
      return text.slice(0, charLimit) + "...";
    }
    return text;
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowLogout(false);
      }
    };

    if (showLogout) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showLogout]);

  return (
    <>
      {menubar ? (
        <RxHamburgerMenu onClick={toggleSidebar} className="cursor-pointer" />
      ) : (
        <div className="flex gap-4 items-center">
          <div
            className="bg-[#564bf136] p-3 m-4 rounded-md cursor-pointer"
            onClick={() => navigate(-1)}
          >
            <BsArrowLeft className="text-[#564BF1] w-6 h-6 font-semibold" />
          </div>
          <div>
            <p className="font-medium text-lg">{htext}</p>
            <p className="text-gray-500">{date}</p>
          </div>
        </div>
      )}

      <div
        ref={modalRef}
        className="flex items-center space-x-4 font-semibold justify-end"
      >
        {!isConnected ? (
          <div className="border border-gray-200 px-4 py-2 animate-pulse"></div>
        ) : (
          <div className="rounded-md px-2 py-1 flex items-center gap-2 border border-gray-200 bg-[#5442f60d] text-[#5542F6]">
            <img src={logo} alt="" className="w-8 h-6" />
            <p className="text-xl font-medium">{balance}</p>
          </div>
        )}{" "}
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
      </div>

      {showLogout && (
        <div
          ref={dropdownRef}
          className="absolute right-6 top-16 mt-2 bg-gray-200 z-50 p-2 rounded"
        >
          {isConnected ? (
            <div className="flex flex-col gap-2 z-10">
              <button
                className="font-xs text-[#2E2C34] flex items-center gap-1 font-semibold px-3 py-2 w-36 hover:bg-gray-50 border border-gray-50"
                onClick={() => {
                  handleCopy(principalText);
                }}
              >
                <IoCopyOutline />
                Copy
              </button>
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
    </>
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
// Mobile Header Component
export function MobileHeader({ htext }) {
  const navigate = useNavigate();

  return (
    <div className="flex gap-4 items-center justify-start">
      <div
        className="bg-[#564bf136] p-2 rounded-md cursor-pointer"
        onClick={() => navigate(-1)}
      >
        <BsArrowLeft className="text-[#564BF1] w-5 h-5 font-semibold" />
      </div>
      <div>
        <p className="font-medium text-md">{htext}</p>
        <p className="text-gray-500 text-sm">16.04.2024 20:55</p>
      </div>
    </div>
  );
}
