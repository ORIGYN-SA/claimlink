import { motion } from "framer-motion";
import React, { useState } from "react";
import { TbInfoHexagon } from "react-icons/tb";
import { TfiPlus } from "react-icons/tfi";
import StyledDropzone from "../../common/StyledDropzone";
import Toggle from "react-toggle";
import { GoDownload } from "react-icons/go";
import { BsCopy, BsQrCode } from "react-icons/bs";
// import "react-toggle/style.css";

const CreateDispenser = () => {
  const [formData, setFormData] = useState({
    campaign: "",
    csvFile: null,
    redirectUrl: "",
    whitelistCsv: null,
    redirectEnabled: false,
    whitelistEnabled: false,
    title: "", // Add title state
    tokenAmount: 0, // Add token amount state
    metadata: "", // Add metadata state
    additionalInfo: "", // Add additional info state
    whitelist: [], // Add whitelist state
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.campaign && !formData.csvFile) {
      newErrors.campaign = "Please select a campaign or upload a CSV file.";
    }

    if (formData.redirectEnabled && !formData.redirectUrl) {
      newErrors.redirectUrl = "Please enter a redirect URL.";
    }

    if (formData.whitelistEnabled && !formData.whitelistCsv) {
      newErrors.whitelistCsv = "Please upload a whitelist CSV file.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Assuming you have an async function `createDispenser` to handle dispenser creation
      try {
        const response = await createDispenser(
          formData.title,
          formData.tokenAmount,
          formData.metadata,
          formData.additionalInfo,
          formData.whitelistEnabled ? formData.whitelist : null
        );
        console.log("Dispenser created:", response);
      } catch (error) {
        console.error("Failed to create dispenser:", error);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (file, name) => {
    setFormData({
      ...formData,
      [name]: file,
    });
  };

  const handleToggleChange = (name) => {
    setFormData({
      ...formData,
      [name]: !formData[name],
    });
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
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="flex"
    >
      <div className="p-6 w-full md:w-2/3">
        <div>
          <h2 className="text-xl font-semibold">New Dispenser</h2>
          <p className="text-gray-400 text-sm mt-2">
            Dispenser app is represented by a single link or QR code that you
            can share for multiple users to scan to claim a unique token.
            Scanning is limited within a certain timeframe.
          </p>
        </div>
        <div className="border border-gray-300 my-6"></div>
        <div>
          <form onSubmit={handleSubmit}>
            {/* Title input */}
            <div className="flex flex-col">
              <label htmlFor="title" className="text-md font-semibold py-3">
                Title
              </label>
              <input
                type="text"
                name="title"
                id="title"
                className="bg-white px-2 py-2 outline-none border border-gray-200 rounded-md"
                value={formData.title}
                onChange={handleChange}
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
              )}
            </div>

            {/* Token Amount input */}
            <div className="flex flex-col mt-4">
              <label
                htmlFor="tokenAmount"
                className="text-md font-semibold py-3"
              >
                Token Amount
              </label>
              <input
                type="number"
                name="tokenAmount"
                id="tokenAmount"
                className="bg-white px-2 py-2 outline-none border border-gray-200 rounded-md"
                value={formData.tokenAmount}
                onChange={handleChange}
              />
              {errors.tokenAmount && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.tokenAmount}
                </p>
              )}
            </div>

            {/* Metadata input */}
            <div className="flex flex-col mt-4">
              <label htmlFor="metadata" className="text-md font-semibold py-3">
                Metadata
              </label>
              <input
                type="text"
                name="metadata"
                id="metadata"
                className="bg-white px-2 py-2 outline-none border border-gray-200 rounded-md"
                value={formData.metadata}
                onChange={handleChange}
              />
              {errors.metadata && (
                <p className="text-red-500 text-sm mt-1">{errors.metadata}</p>
              )}
            </div>

            {/* Additional Info input */}
            <div className="flex flex-col mt-4">
              <label
                htmlFor="additionalInfo"
                className="text-md font-semibold py-3"
              >
                Additional Info
              </label>
              <input
                type="text"
                name="additionalInfo"
                id="additionalInfo"
                className="bg-white px-2 py-2 outline-none border border-gray-200 rounded-md"
                value={formData.additionalInfo}
                onChange={handleChange}
              />
              {errors.additionalInfo && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.additionalInfo}
                </p>
              )}
            </div>

            {/* Whitelist setup */}
            <div className="mt-8 flex justify-between items-center">
              <label
                htmlFor="whitelistEnabled"
                className="text-md font-semibold"
              >
                Whitelist setup
              </label>
              <Toggle
                className="px-3 py-2"
                id="whitelistEnabled"
                checked={formData.whitelistEnabled}
                onChange={() => handleToggleChange("whitelistEnabled")}
              />
            </div>
            {formData.whitelistEnabled && (
              <div className="mt-2 flex flex-col">
                <label
                  htmlFor="whitelistCsv"
                  className="text-md font-semibold py-3"
                >
                  Upload Whitelist CSV
                </label>
                <StyledDropzone
                  onFileChange={(file) =>
                    handleFileChange(file, "whitelistCsv")
                  }
                />
                {errors.whitelistCsv && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.whitelistCsv}
                  </p>
                )}
              </div>
            )}

            <button
              type="submit"
              className="px-6 py-3 w-full md:w-auto mt-6 bg-[#5542F6] text-white rounded-md text-sm"
            >
              Apply changes
            </button>
          </form>
        </div>
      </div>
      <div className="w-1/3 md:inline hidden bg-white p-6">
        {/* Sidebar content */}
        <h2 className="font-semibold text-xl">Dispenser</h2>
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
            <div className="flex space-x-2">
              <button className="text-[#5542F6]">
                <BsCopy />
              </button>
              <button className="text-[#5542F6]">
                <BsQrCode />
              </button>
              <button className="text-[#5542F6]">
                <GoDownload />
              </button>
            </div>
          </div>
          <div className="flex justify-between mt-2">
            <p className="text-gray-500">Claimed Tokens</p>
            <p className="text-gray-800">0</p>
          </div>
          <div className="flex justify-between mt-2">
            <p className="text-gray-500">Total Tokens</p>
            <p className="text-gray-800">0</p>
          </div>
        </div>
        <div className="border border-gray-300 my-6"></div>
        <div className="flex justify-between items-center">
          <p className="text-gray-800 font-medium">Distribution</p>
          <button className="px-4 py-2 bg-[#5542F6] text-white rounded-md text-sm">
            View
          </button>
        </div>
        <div className="mt-2 w-full">
          <div className="flex justify-between">
            <p className="text-gray-500">Campaign</p>
            <p className="text-gray-800">Not linked</p>
          </div>
          <div className="flex justify-between mt-2">
            <p className="text-gray-500">CSV Uploaded</p>
            <p className="text-gray-800">{formData.csvFile ? "Yes" : "No"}</p>
          </div>
        </div>
        <div className="border border-gray-300 my-6"></div>
        <div className="flex justify-between items-center">
          <p className="text-gray-800 font-medium">Preview QR Code</p>
          <div className="flex space-x-2">
            <button className="px-4 py-2 bg-[#5542F6] text-white rounded-md text-sm">
              Copy
            </button>
            <button className="px-4 py-2 bg-[#5542F6] text-white rounded-md text-sm">
              Download
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CreateDispenser;
