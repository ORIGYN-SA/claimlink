import React, { useState } from "react";
import { FaCog, FaCode, FaGasPump, FaTimes } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";
import { AiOutlineLink } from "react-icons/ai";
import Summary from "./Summary";
import { TbWallet } from "react-icons/tb";
import { motion } from "framer-motion";
import MainButton, { BackButton } from "../../common/Buttons";

const DistributionPage = ({ handleNext, handleBack }) => {
  const [claimType, setClaimType] = useState("");
  const [sponsorGas, setSponsorGas] = useState(false);
  const [tokenIds, setTokenIds] = useState("");
  const [errors, setErrors] = useState({});

  const handleClaimTypeChange = (type) => {
    setClaimType(type);
  };

  const handleSponsorGasChange = (sponsor) => {
    setSponsorGas(sponsor);
  };

  const handleTokenIdsChange = (e) => {
    setTokenIds(e.target.value);
  };

  const validate = () => {
    let tempErrors = {};
    tempErrors.tokenIds = tokenIds ? "" : "Token IDs are required.";
    setErrors(tempErrors);
    return Object.values(tempErrors).every((x) => x === "");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      console.log({ claimType, sponsorGas, tokenIds });
      handleNext();
    }
  };

  const pageVariants = {
    initial: {
      opacity: 0,
      x: "-100vw",
    },
    in: {
      opacity: 1,
      x: 0,
    },
    out: {
      opacity: 0,
      x: "100vw",
    },
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.8,
  };

  return (
    <>
      <motion.div
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
        className="flex justify-between"
      >
        <form onSubmit={handleSubmit} className="p-8 sm:w-[70%] w-full">
          <h2 className="text-2xl text-gray-900 font-semibold mb-4">
            Distribution
          </h2>
          <p className="text-gray-500 text-sm mt-4 mb-8">
            Choose the desired claim pattern and proceed with the appropriate
            transaction to enable it
          </p>

          <div className="mb-4">
            <div className="sm:w-[75%] w-full flex rounded-lg h-20 gap-4 border-2 p-4 border-gray-100 bg-white cursor-pointer">
              <IoSettingsOutline
                size={24}
                className="text-[#5542F6] flex items-center h-full"
                onClick={() => handleClaimTypeChange("manual")}
              />
              <div>
                <p className="font-semibold">Manual</p>
                <p className="text-sm text-gray-500">
                  Select tokens to generate links
                </p>
              </div>
            </div>
            <div className="sm:w-[75%] w-full mt-4 flex rounded-lg h-24 gap-4 border-2 p-4 border-gray-100 bg-white cursor-pointer">
              <AiOutlineLink
                size={32}
                className="text-[#5542F6] flex items-center h-full"
                onClick={() => handleClaimTypeChange("sdk")}
              />
              <div>
                <p className="font-semibold">SDK</p>
                <p className="text-sm text-gray-500">
                  Setup and use our SDK to generate links on the fly
                </p>
              </div>
            </div>
          </div>

          <div className="mb-4 mt-4">
            <h3 className="text-xl font-semibold mb-4">Gasless claiming</h3>
            <p className="text-sm text-gray-500 sm:w-[75%] w-full mb-4">
              Selecting to sponsors transactions will allow users to claim
              tokens without having any ICP in their wallet, otherwise users
              will pay gas to cover transactions themselves
            </p>
            <div className="sm:w-[75%] text-sm sm:text-lg w-full flex rounded-lg h-20 gap-4 border-2 p-4 border-gray-100 bg-white">
              <TbWallet
                size={32}
                className="text-[#5542F6] flex items-center h-full"
              />
              <button
                type="button"
                className={`p-2 ${
                  sponsorGas ? "bg-blue-500 text-white" : " font-semibold"
                }`}
                onClick={() => handleSponsorGasChange(true)}
              >
                Sponsor claiming gas fees (+ 0.3 ICP per link)
              </button>
            </div>
            <div className="sm:w-[75%] w-full flex mt-4 rounded-lg font-semibold h-20 gap-4 border-2 p-4 border-gray-100 bg-white">
              <TbWallet
                size={32}
                className="text-[#5542F6] flex items-center h-full"
              />
              <button
                type="button"
                className={`p-2 ${!sponsorGas ? "font-semibold" : "bg-white"}`}
                onClick={() => handleSponsorGasChange(false)}
              >
                No sponsoring
              </button>
            </div>
          </div>

          <div className="mb-4 sm:flex justify-between sm:w-[75%] w-full">
            <h3 className="sm:text-lg font-semibold mb-2">
              Add token IDs to distribute
            </h3>
            <div className="flex sm:justify-between gap-4">
              <button
                type="button"
                className="px-4 sm:px-3 py-1 border sm:text-sm text-xs bg-[#dad6f797] text-[#5542F6] rounded-lg"
                onClick={() => handleClaimTypeChange("manual")}
              >
                Set manually
              </button>
              <button
                type="button"
                className="px-4 sm:px-3 py-1 sm:text-sm text-xs border bg-[#5542F6] text-white rounded-lg"
                onClick={() => handleClaimTypeChange("selectAll")}
              >
                Select all
              </button>
            </div>
          </div>
          <input
            type="text"
            value={tokenIds}
            onChange={handleTokenIdsChange}
            className="sm:w-[75%] w-full h-16 rounded outline-none border-2 px-3 border-gray-100"
            placeholder="Enter token IDs"
          />
          {errors.tokenIds && (
            <p className="text-red-500 text-sm mt-2">{errors.tokenIds}</p>
          )}

          <p className="mb-6 text-sm text-gray-500 sm:w-[75%] w-full mt-4">
            If you have a big set of different tokens to distribute, you could
            also provide the information by{" "}
            <span className="text-[#5542F6] cursor-pointer">
              uploading CSV file
            </span>
            .
          </p>

          <div className="mt-10 flex space-x-3 w-full">
            <BackButton text={"Back"} onClick={handleBack} />
            <MainButton text={"Next"} type="submit" />
          </div>
        </form>
        <Summary />
      </motion.div>
    </>
  );
};

export default DistributionPage;
