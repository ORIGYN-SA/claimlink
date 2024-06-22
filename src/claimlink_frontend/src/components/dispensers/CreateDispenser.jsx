import { motion } from "framer-motion";
import React, { useState } from "react";
import { TbInfoHexagon } from "react-icons/tb";
import { TfiPlus } from "react-icons/tfi";

const CreateDispenser = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      setSelectedFile(event.dataTransfer.files[0]);
      event.dataTransfer.clearData();
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };
  return (
    <motion.div
      initial={{ scale: 1, opacity: 0, x: 50 }}
      animate={{ opacity: 1, scale: 1, x: 100 }}
      exit={{ x: -150 }}
      className="flex"
    >
      <div className="p-6 w-2/3">
        <div>
          <h2 className="text-xl font-semibold">New Dispenser </h2>
          <p className="text-gray-400 text-sm mt-2">
            Dispenser app is represented by a single link or QR code that you
            can share for multiple users to scan to claim a unique token.
            Scanning is limited within a certain timeframe
          </p>
        </div>
        <div className="border border-gray-300 my-6"></div>
        <div>
          <form action="">
            <div className=" flex flex-col ">
              <label htmlFor="title" className="text-md font-semibold py-3 ">
                Connect to claim links
              </label>
              <p className="text-gray-400 text-sm mb-3 ">
                Choose existing campaign or upload a CSV file with links. Number
                of rows in the file should be equal to the number of QR codes.
              </p>
              <select
                name=""
                id=""
                className="bg-white px-2 py-2 outline-none border border-gray-200 rounded-md"
              >
                <option value="">Choose campaign</option>
                <option value="">My last campaign</option>
                <option value="">My last campaign</option>
              </select>
              <div className="flex mt-2 gap-3">
                <p className="px-2 py-1 text-gray-400 text-sm rounded-lg bg-gray-300">
                  My last campaign
                </p>
                <p className="px-2 py-1 text-gray-400 text-sm rounded-lg bg-gray-300">
                  My last campaign
                </p>
              </div>
            </div>
            <div className="mt-2 flex flex-col ">
              <label htmlFor="title" className="text-md font-semibold py-3 ">
                Upload CSV
              </label>
              <div className="">
                <div
                  className="border-2 border-dotted border-gray-400 rounded-xl  flex flex-col items-center justify-center cursor-pointer"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                >
                  <motion.div
                    initial={{ scale: 1, opacity: 1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.9 }}
                    className="flex flex-col items-center justify-center"
                  >
                    <div className="bg-white p-3 m-4 rounded-md">
                      <TfiPlus className="text-[#564BF1] w-8 h-8 font-semibold" />
                    </div>
                    <h2 className="text-[#564BF1] text-lg sm:text-xl font-semibold mt-3">
                      Drag and Drop or Click to Upload
                    </h2>
                    <p className="text-[#564BF1] text-sm text-center mt-2">
                      You can drag and drop a file here or click to select a
                      file to upload.
                    </p>
                  </motion.div>
                  <input
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleFileChange}
                  />
                </div>
                {selectedFile && (
                  <div className="mt-4">
                    <p>Selected File: {selectedFile.name}</p>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-2 flex flex-col ">
              <label htmlFor="title" className="text-md font-semibold py-3 ">
                Duration
              </label>
              <input
                type="text"
                name=""
                id=""
                className="bg-white px-2 py-2 outline-none border border-gray-200 rounded-md"
                placeholder="Text"
              />
              <div className="flex items-center gap-4 mt-2 ">
                <TbInfoHexagon className="text-[#564BF1]" />
                <p className="text-sm text-gray-500">
                  Enter duration in minutes
                </p>
              </div>
            </div>
          </form>
          <button className="px-6 py-2 mt-6 bg-[#5542F6] text-white rounded-md text-sm">
            Create
          </button>
        </div>
      </div>
      <div className="w-1/3">fgfg</div>
    </motion.div>
  );
};

export default CreateDispenser;
