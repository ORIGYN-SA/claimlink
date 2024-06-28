import { motion } from "framer-motion";
import React, { useMemo } from "react";
import { TbInfoHexagon } from "react-icons/tb";
import { TfiPlus } from "react-icons/tfi";
import StyledDropzone from "../../common/StyledDropzone";
import Toggle from "react-toggle";
import { GoDownload, GoLink } from "react-icons/go";
import { BsCopy, BsQrCode } from "react-icons/bs";
import { IoSettingsOutline } from "react-icons/io5";
import { PiLinkSimple } from "react-icons/pi";
// import "react-toggle/style.css";

const DistributionPages = () => {
  // const handleCheeseChange = () => {
  //   setFormData((prevFormData) => ({
  //     ...prevFormData,
  //     featured: !prevFormData.featured,
  //   }));
  // };

  const val = `0xf94B9dA12AE677CF90B7A85e695cC805dfc0D829
0xf94B9dA12AE677CF90B7A85e695cC805dfc0D829
0xf94B9dA12AE677CF90B7A85e695cC805dfc0D829 etc`;
  return (
    <motion.div
      initial={{ scale: 1, opacity: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{}}
      className="flex"
    >
      <div className="p-6 w-2/3">
        <div>
          <h2 className="text-xl font-semibold">Distrubution </h2>
          <p className="text-gray-400 text-sm mt-2">
            Choose the desired claim pattern and proceed with the appropriate
            transaction to enable it
          </p>
        </div>
        <div className="mt-4">
          <form action="">
            <div className="mt-2 flex bg-white px-4 py-3 items-center rounded-lg gap-4 border border-gray-200">
              <IoSettingsOutline className="w-6 h-6 text-[#5542F6]" />
              <div className="">
                <h4 className="font-medium text-lg ">Manual</h4>
                <p className="text-grat-500 text-sm">
                  Select tokens to generate links
                </p>
              </div>
            </div>
            <div className="mt-2 flex bg-white px-4 py-3 items-center rounded-lg gap-4 border border-gray-200">
              <PiLinkSimple className="w-6 h-6 text-[#5542F6]" />
              <div className="">
                <h4 className="font-medium text-lg ">SDK</h4>
                <p className="text-grat-500 text-sm">
                  Set up and use our SDK to generate links on the fly
                </p>
              </div>
            </div>
            <div className=" flex flex-col mt-4">
              <label htmlFor="title" className="text-md font-semibold py-3 ">
                Gasless claiming
              </label>
              <p className="text-gray-400 text-sm mb-3 ">
                Selecting to sponsor transactions will allow users to claim
                tokens without having any MATIC in their wallets, otherwise
                users will pay gas to cover transactions themselves
              </p>
              <div className="mt-2 flex bg-white px-4 py-3 items-center rounded-lg gap-4 border border-gray-200">
                <PiLinkSimple className="w-6 h-6 text-[#5542F6]" />
                <div className="">
                  <h4 className="font-medium text-lg ">
                    Sponsor claiming gas fees (+ 0.3 MATIC per link)
                  </h4>
                </div>
              </div>
              <div className="mt-2 flex bg-white px-4 py-3 items-center rounded-lg gap-4 border border-gray-200">
                <PiLinkSimple className="w-6 h-6 text-[#5542F6]" />
                <div className="">
                  <h4 className="font-medium text-lg ">
                    Sponsor claiming gas fees (+ 0.3 MATIC per link)
                  </h4>
                </div>
              </div>
            </div>
            <div className=" flex flex-col mt-6 ">
              <div className="flex justify-between mb-2">
                <label htmlFor="title" className="text-md font-semibold ">
                  Add token IDs to distribute
                </label>
                <div className="flex mt-2 gap-3">
                  <p className="px-2 py-1 text-[#5542F6] text-sm rounded-lg bg-gray-300">
                    Set manually
                  </p>
                  <p className="px-2 py-1 text-white text-sm rounded-lg bg-[#5542F6]">
                    select all
                  </p>
                </div>
              </div>
              <select
                name=""
                id=""
                className="bg-white px-2 py-2 outline-none border border-gray-200 rounded-md"
              >
                <option value="">Choose campaign</option>
                <option value="">My last campaign</option>
                <option value="">My last campaign</option>
              </select>
            </div>
            <div className="flex items-center gap-4 mt-2 ">
              <TbInfoHexagon className="text-[#564BF1]" />
              <p className="text-sm text-gray-500">
                If you have a big set of different tokens to distribute, you
                couls also provide the information by uploading CSV file
              </p>
            </div>
          </form>
          <div className="flex gap-4">
            <button className="px-6 py-3 mt-6 text-[#5542F6] bg-white rounded-md text-sm">
              Back
            </button>
            <button className="px-6 py-3 mt-6 bg-[#5542F6] text-white rounded-md text-sm">
              Approve{" "}
            </button>
          </div>
        </div>
      </div>
      <div className="w-1/3 bg-white p-6">
        <h2 className="font-semibold text-xl">Summary</h2>
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
        </div>
        <div className="border border-gray-300 my-6"></div>
        <div className="mt-2 w-full">
          <div className="flex justify-between">
            <p className="text-gray-800 font-medium">Statistics</p>
            <div className="text-[#564BF1] flex items-center  gap-1 ">
              {" "}
              <GoDownload />
              <p className="underline"> Download full report</p>
            </div>
          </div>
          <div className="flex justify-between mt-2">
            <p className="text-gray-500">Total links</p>
            <p>10</p>
          </div>
          <div className="flex justify-between mt-2">
            <p className="text-gray-500">Scanned</p>
            <p className="text-gray-800">14</p>
          </div>
          <div className="flex justify-between mt-2">
            <p className="text-gray-500">Links left</p>
            <p>10</p>
          </div>
          <div className="flex justify-between mt-2">
            <p className="text-gray-500">Claimed</p>
            <p>0</p>
          </div>
        </div>
        <div className="border border-gray-300 my-6"></div>

        <div className=" flex flex-col ">
          <label htmlFor="title" className="text-md font-semibold pb-3 ">
            Link
          </label>
          <div className="flex items-center gap-2">
            <div className="bg-white px-2 py-2 w-full outline-none border text-[#5542F6] border-gray-200 rounded-md">
              https://claim.link/6DJ8KK
            </div>
            <div className="bg-[#564bf11d] px-2 py-2 outline-none border  border-[#E9E8FC] rounded-md">
              <BsCopy className="w-5 h-5 text-[#564BF1]" />
            </div>
          </div>
        </div>
        <div className="border border-gray-300 my-6"></div>
        <button className="px-6 flex gap-2 items-center justify-center w-full py-3 mt-6 bg-[#5542F6] text-white rounded-md text-sm">
          <BsQrCode />
          Download QR
        </button>
      </div>
    </motion.div>
  );
};

export default DistributionPages;
