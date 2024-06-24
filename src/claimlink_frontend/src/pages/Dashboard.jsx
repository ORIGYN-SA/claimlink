import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import { MdOutlineArrowDropDown } from "react-icons/md";
import Breadcrumb from "../components/Breadcrumb";
import { RxHamburgerMenu } from "react-icons/rx";
import { BsArrowLeft } from "react-icons/bs";

const Dashboard = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex bg-gray-100">
      <div
        className={`fixed top-0 left-0     h-full z-10 transition-transform duration-500 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar setSidebarOpen={toggleSidebar} />
      </div>
      <div
        className={`transition-all duration-500 flex-grow m-0 ${
          isSidebarOpen ? "sm:ml-[250px]" : "ml-0"
        }`}
      >
        <header className="w-full bg-[#FBFAFC] h-[88px] border-b border-gray-300 p-6 flex justify-between items-center">
          <MyNewComponent onClick={toggleSidebar} className="cursor-pointer" />

          <div className="flex items-center space-x-4 font-semibold justify-end">
            <span className="text-[#2E2C34] font-Manrope">0 ICP</span>
            <span className="flex items-center justify-center text-[#2E2C34] font-Manrope rounded-3xl bg-gray-200 px-3 py-2">
              hyw2w-ejnfe-jen.....
              <MdOutlineArrowDropDown size={24} className="text-gray-500" />
            </span>
          </div>
        </header>
        <Breadcrumb />
        <div className="bg-gray-100 m-4">{children}</div>
      </div>
    </div>
  );
};

export default Dashboard;

export const MyNewComponent = ({ children }) => {
  return (
    <>
      <div className="flex gap-4 items-center">
        <div className="bg-[#564bf136] p-3 m-4 rounded-md">
          <BsArrowLeft className="text-[#564BF1] w-6 h-6 font-semibold" />
        </div>
        <div>
          <p className="font-medium  text-lg">New Token</p>
          <p className="text-gray-500 ">16.04.2024 20:55</p>
        </div>
      </div>
    </>
  );
};
