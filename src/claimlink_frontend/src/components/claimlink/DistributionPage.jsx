import React, { useState } from "react";
import { FaCog, FaCode, FaGasPump, FaTimes } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";
import { AiOutlineLink } from "react-icons/ai";
import Summary from "./Summary";
import { TbWallet } from "react-icons/tb";
import { Link } from "react-router-dom";

const DistributionPage = () => {
  const [claimType, setClaimType] = useState("");
  const [sponsorGas, setSponsorGas] = useState(false);
  const [tokenIds, setTokenIds] = useState("");

  const handleClaimTypeChange = (type) => {
    setClaimType(type);
  };

  const handleSponsorGasChange = (sponsor) => {
    setSponsorGas(sponsor);
  };

  const handleTokenIdsChange = (e) => {
    setTokenIds(e.target.value);
  };

  const handleSubmit = () => {
    // handle form submission
    console.log({ claimType, sponsorGas, tokenIds });
  };

  return (
    <div className="flex justify-between">
      <div className="p-8 w-[70%]">
        <h2 className=" text-2xl text-gray-900 font-semibold mb-4">
          Distribution
        </h2>
        <p className="text-gray-500 text-sm mt-4 mb-8">
          Choose the desired claim pattern and proceed with the appropriate
          transaction to enable it
        </p>

        <div className="mb-4 ">
          <div className="w-[75%] flex rounded-lg h-20 gap-4 border-2 p-4 border-gray-100    bg-white ">
            <IoSettingsOutline
              size={24}
              className="text-[#5542F6] flex items-center h-full"
            />
            <div>
              <p className="font-semibold ">Mannual</p>
              <p className="text-sm text-gray-500">
                Select tokens to generate links
              </p>
            </div>
          </div>
          <div className="w-[75%] mt-4 flex rounded-lg h-20 gap-4 border-2 p-4 border-gray-100    bg-white ">
            <AiOutlineLink
              size={24}
              className="text-[#5542F6] flex items-center h-full"
            />
            <div>
              <p className="font-semibold ">SDK</p>
              <p className="text-sm text-gray-500">
                Setup and use our SDK to generate links on the fly
              </p>
            </div>
          </div>
        </div>

        <div className="mb-4 mt-4">
          <h3 className="text-xl font-semibold mb-4">Gasless claiming</h3>
          <p className="text-sm text-gray-500 w-[75%] mb-4">
            Selecting to sponsors transactions will allow users to claim tokens
            without having any ICP in their wallet, otherwise users will pay gas
            to cover transactions themselves
          </p>
          <div className=" w-[75%] flex rounded-lg h-20 gap-4 border-2 p-4 border-gray-100    bg-white">
            <TbWallet
              size={24}
              className="text-[#5542F6] flex items-center h-full"
            />
            <button
              className={`p-2 ${
                sponsorGas ? "bg-blue-500 text-white" : " font-semibold"
              }`}
              onClick={() => handleSponsorGasChange(true)}
            >
              Sponsor claiming gas fees (+ 0.3 ICP per link)
            </button>
          </div>
          <div className="w-[75%] flex mt-4 rounded-lg font-semibold h-20 gap-4 border-2 p-4 border-gray-100    bg-white">
            <TbWallet
              size={24}
              className="text-[#5542F6] flex items-center h-full"
            />
            <button
              className={`p-2  ${!sponsorGas ? "   " : "bg-white"}`}
              onClick={() => handleSponsorGasChange(false)}
            >
              No sponsoring
            </button>
          </div>
        </div>

        <div className="mb-4 flex justify-between w-[75%]">
          <h3 className="text-lg font-semibold mb-2">
            Add token IDs to distribute
          </h3>
          <div className="flex justify-between gap-4 ">
            <button className="px-3 py-1 border text-sm bg-[#dad6f797] text-[#5542F6] rounded-lg ">
              Set manually
            </button>
            <button className="px-3 py-1 border  bg-[#5542F6] text-sm text-white rounded-lg">
              Select all
            </button>
          </div>
        </div>
        <input
          type="text"
          value={tokenIds}
          onChange={handleTokenIdsChange}
          className=" w-[75%] h-16 rounded border-2 px-3 border-gray-100"
          placeholder="Enter token IDs"
        />

        <p className="mb-6 text-sm text-gray-500 w-[75%] mt-4">
          If you have a big set of different tokens to distribute, you could
          also provide the information by{" "}
          <span className="text-[#5542F6]">uploading CSV file</span>.
        </p>

        <div className="mt-10 flex  space-x-3  ">
          <button className="px-4 py-3  w-[20%] border-[#5542F6]  border text-[#5542F6]   text-sm font-quicksand  rounded transition  duration-200   ">
            <Link to="/claim-pattern" className="w-full">
              Back
            </Link>
          </button>
          <Link to="/claim-link/launch" className="w-full">
            <button className="px-4 py-3  w-[20%] bg-[#5542F6]  text-sm font-quicksand  rounded transition  duration-200 hover:bg-blue-600 text-white">
              Next
            </button>
          </Link>
        </div>
      </div>
      <Summary />
    </div>
  );
};

export default DistributionPage;
