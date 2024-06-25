import { motion } from "framer-motion";
import React from "react";
import { TfiPlus } from "react-icons/tfi";
import { useNavigate } from "react-router-dom";

const Dispensers = () => {
  const navigate = useNavigate();

  const createDispenser = () => {
    navigate("/dispensers/create-dispenser");
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex justify-between items-center">
        <h2 className="text-lg sm:text-xl font-semibold">Dispensers</h2>
        <select
          name="Filter"
          id="filter"
          className="border border-gray-400 px-2 py-1 rounded-md outline-none text-sm"
        >
          <option value="filter">Filter</option>
          <option value="new">New</option>
          <option value="old">Old</option>
        </select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4  2xl:grid-cols-4 gap-5 mt-5">
        <motion.div
          initial={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.9 }}
          className="bg-[#E9E8FC] px-4 py-4 rounded-xl flex flex-col items-center justify-center cursor-pointer"
          onClick={createDispenser}
        >
          <div className="bg-white p-3 m-4 rounded-md">
            <TfiPlus className="text-[#564BF1] w-6 h-6 font-semibold" />
          </div>
          <h2 className="text-[#564BF1] text-lg sm:text-xl font-semibold mt-3 text-center">
            Create new dispenser
          </h2>
          <p className="text-[#564BF1] text-sm text-center mt-2">
            Dispenser is represented by a single link or QR code that you can
            share for multiple users to scan to claim a unique token.
          </p>
        </motion.div>

        {[1, 2, 3, 4, 5, 6].map((index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="bg-white px-4 py-4 rounded-xl flex flex-col"
          >
            <img
              width="100px"
              height="80px"
              src="https://images.pexels.com/photos/3621234/pexels-photo-3621234.jpeg?auto=compress&cs=tinysrgb&w=600"
              alt="Dispenser"
            />
            <h2 className="text-lg sm:text-xl font-semibold mt-5 ">Title</h2>
            <p className="text-sm text-gray-500 mt-1 ">April 5, 13:34</p>
            <div className="border border-gray-300 my-4 w-full"></div>
            <div className="mt-2 w-full">
              <div className="flex justify-between">
                <p className="text-gray-500">Status</p>
                <p className="text-red-500">Not Uploaded</p>
              </div>
              <div className="flex justify-between mt-2">
                <p className="text-gray-500">Start Date</p>
                <p>
                  April 11, 2024 <span className="text-gray-500">13:54</span>
                </p>
              </div>
              <div className="flex justify-between mt-2">
                <p className="text-gray-500">Duration</p>
                <p className="text-gray-800">1440 min</p>
              </div>
              <div className="flex justify-between mt-2">
                <p className="text-gray-500">Links</p>
                <p>10</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Dispensers;
