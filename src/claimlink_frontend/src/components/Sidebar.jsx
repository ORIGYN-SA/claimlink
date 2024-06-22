import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaSun, FaMoon } from "react-icons/fa";
import { IoMdStar } from "react-icons/io";
import { AiOutlineLink } from "react-icons/ai";
import { IoIosCloseCircle } from "react-icons/io";
import {
  MdArrowOutward,
  MdDashboard,
  MdLink,
  MdQrCode,
  MdMoney,
} from "react-icons/md";
import { RiStackFill } from "react-icons/ri";

const Sidebar = ({ setSidebarOpen }) => {
  const [isWhiteBackground, setWhiteBackground] = useState(true);
  const location = useLocation();
  const currentPath = location.pathname;

  const menuItems = [
    { path: "/", label: "Dashboard", icon: MdDashboard },
    { path: "/claim-link", label: "Claim links", icon: AiOutlineLink },
    { path: "/dispensers", label: "Dispensers", icon: RiStackFill },
    { path: "/qr-manager", label: "QR manager", icon: MdQrCode },
    { path: "/minter", label: "Minter", icon: MdMoney },
  ];

  return (
    <>
      <div
        className={`sm:block sm:w-[250px] w-[100%] bg-white h-full overflow-y-auto scroll-hidden ${
          isWhiteBackground ? "bg-[#FBFAFC]" : "bg-gray-800"
        }  flex flex-col justify-between  px-2 transition-all duration-300 border-r border-gray-300`}
      >
        <div className="px-2">
          <p className="text-4xl w-full tracking-wide h-[88px] text-[#2E2C34] font-quicksand items-center gap-2 justify-center flex">
            claimlink
            <MdArrowOutward className="bg-[#3B00B9] rounded text-white" />
            <IoIosCloseCircle
              className="text-[#3B00B9] rounded-full  bg-white  sm:hidden "
              onClick={setSidebarOpen}
            />
          </p>

          {/* <button
          onClick={toggleBackground}
          className="mb-4 p-2 bg-green-500 text-white rounded-md flex items-center justify-center"
        >
          {isWhiteBackground ? <FaMoon /> : <FaSun />}
        </button> */}

          <div className="mb-4  space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={` flex items-center tracking-wide h-[48px] text-xs font-quicksand  font-semibold gap-2 py-3 p-2 rounded transition duration-200 ${
                  currentPath === item.path
                    ? "bg-[#dad6f797]  text-[#5542F6]"
                    : isWhiteBackground
                    ? "text-[#878097]"
                    : "text-white"
                } hover:bg-[#b8b2ea97]`}
              >
                <item.icon
                  className={`flex ${
                    currentPath === item.path
                      ? "text-[#5542F6]"
                      : "text-gray-400"
                  } hover:text-[#5542F6]`}
                  size={20}
                />
                {item.label}
              </Link>
            ))}
          </div>
          <div className="mt-44">
            <div className="border-t border-gray-200 mb-2"></div>
            <Link
              to="/technical-help"
              className={`flex items-center py-3 px-2 tracking-wide mb-2 rounded  h-[32px] text-xs font-quicksand  font-semibold transition  duration-200 hover:bg-gray-300 ${
                isWhiteBackground ? " text-[#878097]" : "text-white"
              }`}
            >
              Technical Help
            </Link>
            <Link
              to="/contact-us"
              className={`py-3 px-2 rounded   h-[32px] tracking-wider text-xs font-quicksand  font-semibold flex items-center transition duration-200 hover:bg-gray-300 ${
                isWhiteBackground ? " text-[#878097]" : "text-white"
              }`}
            >
              Contact Us
            </Link>
          </div>
        </div>

        <div className="flex flex-col shadow-lg rounded-md mt-12 p-4 mx-4">
          <p
            className={`mb-4  text-xs font-quicksand    ${
              isWhiteBackground ? "text-[#2E2C34]" : "text-gray-400"
            }`}
          >
            Release your maximum potential software
          </p>
          <button className="px-4 py-2 bg-[#5542F6]  text-xs font-quicksand  rounded transition  duration-200 hover:bg-blue-600 text-white">
            Upgrade to Pro
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
