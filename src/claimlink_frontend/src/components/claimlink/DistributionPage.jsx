import React, { useState } from "react";
import { FaCog, FaCode, FaGasPump, FaTimes } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";
import { AiOutlineLink } from "react-icons/ai";
import Summary from "./Summary";
import { TbWallet } from "react-icons/tb";

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
      <div className="p-8">
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
          <h3 className="text-lg font-semibold mb-2">Gasless claiming</h3>
          <div className=" w-[75%] flex rounded-lg h-20 gap-4 border-2 p-4 border-gray-100    bg-white">
            <TbWallet
              size={24}
              className="text-[#5542F6] flex items-center h-full"
            />
            <button
              className={`p-2 ${
                sponsorGas ? "bg-blue-500 text-white" : "bg-white"
              }`}
              onClick={() => handleSponsorGasChange(true)}
            >
              Sponsor claiming gas fees (+ 0.3 ICP per link)
            </button>
          </div>
          <div className="w-[75%] flex rounded-lg h-20 gap-4 border-2 p-4 border-gray-100    bg-white">
            <TbWallet
              size={24}
              className="text-[#5542F6] flex items-center h-full"
            />
            <button
              className={`p-2  ${
                !sponsorGas ? "bg-blue-500 text-white" : "bg-white"
              }`}
              onClick={() => handleSponsorGasChange(false)}
            >
              No sponsoring
            </button>
          </div>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">
            Add token IDs to distribute
          </h3>
          <input
            type="text"
            value={tokenIds}
            onChange={handleTokenIdsChange}
            className="p-2 border w-full mb-2"
            placeholder="Enter token IDs"
          />
          <div className="flex justify-between">
            <button className="p-2 border">Set manually</button>
            <button className="p-2 border">Select all</button>
          </div>
        </div>

        <p className="mb-6">
          If you have a big set of different tokens to distribute, you could
          also provide the information by uploading CSV file.
        </p>

        <button onClick={handleSubmit} className="p-2 bg-blue-500 text-white">
          Next
        </button>
        <button className="p-2 border ml-4">Back</button>
      </div>
      <Summary />
    </div>
  );
};

export default DistributionPage;
