import { BsArrowLeft } from "react-icons/bs";
import { MdOutlineArrowDropDown } from "react-icons/md";
import { RxHamburgerMenu } from "react-icons/rx";

import { PlugLogin, StoicLogin, NFIDLogin, IdentityLogin } from "ic-auth";
import { Principal } from "@dfinity/principal";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../connect/useClient";

export const Header = ({ htext, menubar, toggleSidebar }) => {
  const navigate = useNavigate();
  const [showLogout, setShowLogout] = useState(false);

  const handleDropdownClick = () => {
    setShowLogout((prev) => !prev);
  };
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  const { login, isAuthenticated, principal, logout } = useAuth();
  const [principals, setPrincipal] = useState("webf-uwebf-sesu");
  console.log(isAuthenticated);

  setTimeout(() => {
    if (isAuthenticated) {
      setPrincipal(principal.toText());
    }
  }, 5000);

  return (
    <>
      {menubar ? (
        <RxHamburgerMenu onClick={toggleSidebar} className="cursor-pointer" />
      ) : (
        <div className="flex gap-4 items-center">
          <div
            className="bg-[#564bf136] p-3 m-4 rounded-md"
            onClick={() => navigate(-1)}
          >
            <BsArrowLeft className="text-[#564BF1] w-6 h-6 font-semibold" />
          </div>
          <div>
            <p className="font-medium text-lg">{htext}</p>
            <p className="text-gray-500">16.04.2024 20:55</p>
          </div>
        </div>
      )}

      <div className="flex items-center space-x-4 font-semibold justify-end">
        <span className="text-[#2E2C34] font-Manrope">0 ICP</span>
        <span
          className="flex items-center justify-center text-[#2E2C34] font-Manrope  rounded-3xl bg-gray-200 px-3 py-2"
          onClick={handleDropdownClick}
        >
          {principals}
          <MdOutlineArrowDropDown size={24} className="text-gray-500" />
        </span>
      </div>
      {showLogout && (
        <button
          className="absolute right-6 top-16 mt-2 bg-gray-200 font-xs text-[#2E2C34] font-semibold rounded-3xl px-3 py-2 w-36"
          onClick={() => {
            handleLogout();
          }}
        >
          {isAuthenticated ? " Logout" : "Login"}
        </button>
      )}
    </>
  );
};

export function MobileHeader({ htext }) {
  const navigate = useNavigate();

  return (
    <div className="flex gap-4 items-center justify-start">
      <div
        className="bg-[#564bf136] p-2  rounded-md"
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
