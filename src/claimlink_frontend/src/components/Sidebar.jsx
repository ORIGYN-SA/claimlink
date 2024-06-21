import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaSun, FaMoon } from "react-icons/fa";
import { IoMdStar } from "react-icons/io";
import { MdArrowOutward } from "react-icons/md";

const Sidebar = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isWhiteBackground, setWhiteBackground] = useState(true);
  const location = useLocation();
  const currentPath = location.pathname;

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);
  const toggleBackground = () => setWhiteBackground(!isWhiteBackground);

  const menuItems = [
    { path: "/", label: "Dashboard" },
    { path: "/claim-link", label: "Claim Links" },
    { path: "/dispensers", label: "Dispensers" },
    { path: "/qr-manager", label: "QR Manager" },
    { path: "/minter", label: "Minter" },
  ];

  return (
    <div
      className={` sm:block hidden h-full ${
        isWhiteBackground ? "bg-[#FBFAFC]" : "bg-gray-800"
      } ${
        isSidebarOpen ? "w-72" : "w-16"
      } flex flex-col justify-between p-4 px-2 transition-all duration-300 border-r border-gray-300`}
    >
      <div>
        <p className="text-3xl   w-full font-manrope text-[#2E2C34] m-2 ml-6 items-center gap-2 justify-start flex ">
          claimlink
          <MdArrowOutward className="bg-[#3B00B9] rounded text-white" />
        </p>

        {/* <button
          onClick={toggleBackground}
          className="mb-4 p-2 bg-green-500 text-white rounded-md flex items-center justify-center"
        >
          {isWhiteBackground ? <FaMoon /> : <FaSun />}
        </button> */}
        {isSidebarOpen && (
          <>
            <div className="mb-4 mt-8 space-y-2">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center font-manrope gap-2 py-2.5 px-4 rounded transition duration-200   ${
                    currentPath === item.path
                      ? "bg-[#dad6f797] text-[#2E2C34]"
                      : isWhiteBackground
                      ? "text-[#2E2C34]"
                      : "text-white"
                  } hover:bg-[#b8b2ea97]`}
                >
                  <IoMdStar
                    className={` ${
                      currentPath === item.path
                        ? "text-[#5542F6]"
                        : "text-gray-400"
                    } hover:text-[#5542F6]`}
                    size={24}
                  />
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="mt-28">
              <div className="border-t border-gray-200"></div>
              <Link
                to="/technical-help"
                className={`block py-2.5 px-4 rounded  font-manrope transition duration-200 hover:bg-gray-300 ${
                  isWhiteBackground ? "text-[#504F54]" : "text-white"
                }`}
              >
                Technical Help
              </Link>
              <Link
                to="/contact-us"
                className={`block py-2.5 px-4 rounded  font-manrope transition duration-200 hover:bg-gray-300 ${
                  isWhiteBackground ? "text-[#504F54]" : "text-white"
                }`}
              >
                Contact Us
              </Link>
            </div>
          </>
        )}
      </div>
      {isSidebarOpen && (
        <div className="flex flex-col shadow-lg p-4 mx-4">
          <p
            className={`mb-4 text-sm  font-Manrope  ${
              isWhiteBackground ? "text-[#2E2C34]" : "text-gray-400"
            }`}
          >
            Release your maximum potential software
          </p>
          <button className="px-4 py-2 bg-[#5542F6] font-Manrope  rounded transition text-sm duration-200 hover:bg-blue-600 text-white">
            Upgrade to Pro
          </button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
