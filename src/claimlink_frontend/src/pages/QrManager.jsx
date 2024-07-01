import React from "react";
import { FaPlus } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { Link } from "react-router-dom";
import InfoCard from "../common/InfoCard";
import { motion } from "framer-motion";
import { IoIosAdd } from "react-icons/io";
import Breadcrumb from "../components/Breadcrumb";

const QrManager = () => {
  return (
    <>
      {" "}
      <div className="hidden sm:block"></div>
      <div className="min-h-screen p-4 ">
        <div className="flex items-center justify-between w-full p-2">
          <p className="text-xl font-semibold">QR manager</p>
          <div className="sm:hidden">
            <button className=" flex items-center justify-center  text-sm border-[#5542F6] bg-[#5542F6] gap-2 px-4 py-1 border  text-white rounded capitalize">
              <IoIosAdd className="text-center " size={20} />
              New QR set
            </button>
          </div>
          <div className="hidden sm:block">
            <select
              name="Filter"
              id="filter"
              className=" flex items-center justify-center border-[#5542F6] gap-2 px-4 py-1 border  text-[#5542F6] rounded capitalize"
            >
              <IoIosArrowDown className="text-center " size={12} />
              <option value="filter">Filter</option>
              <option value="new">New</option>
              <option value="old">Old</option>
            </select>
          </div>
        </div>
        <div className="grid mobile:grid-col-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4  ">
          <Link to="/qr-setup" className="w-full   mb-4   ">
            <NewCampaignCard />
          </Link>
          {Array(3)
            .fill(0)
            .map((_, index) => (
              <div key={index} className="w-full  p-2 ">
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1 }}
                >
                  <InfoCard />
                </motion.div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

const NewCampaignCard = () => {
  return (
    <div className=" hidden sm:block w-full h-full">
      <div className=" m-2 mb-2 flex flex-col items-center justify-center rounded-lg h-full bg-[#dad6f797]  text-center">
        <div className=" w-12 h-12 rounded-md bg-white flex items-center justify-center mx-auto mb-4">
          <FaPlus className="text-[#5542F6]" />
        </div>
        <h2 className="text-lg font-semibold text-[#5542F6] mb-2">
          Create QR codes
        </h2>
        <p className="text-[#5542F6] text-xs px-4">
          Create QR codes and connnect to claim links
        </p>
      </div>
    </div>
  );
};

export default QrManager;
