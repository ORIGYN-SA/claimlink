import { motion } from "framer-motion";
import React, { useMemo } from "react";
import { TbInfoHexagon } from "react-icons/tb";
import { TfiPlus } from "react-icons/tfi";
import StyledDropzone from "../../common/StyledDropzone";
import Toggle from "react-toggle";
import { GoDownload } from "react-icons/go";
import { BsCopy, BsQrCode } from "react-icons/bs";
// import "react-toggle/style.css";

const CreateDispenser = () => {
  // const handleCheeseChange = () => {
  //   setFormData((prevFormData) => ({
  //     ...prevFormData,
  //     featured: !prevFormData.featured,
  //   }));
  // };

  const val = `0xf94B9dA12AE677CF90B7A85e695cC805dfc0D829
0xf94B9dA12AE677CF90B7A85e695cC805dfc0D829
0xf94B9dA12AE677CF90B7A85e695cC805dfc0D829 etc`;
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
      <div className="p-6  w-full md:w-2/3">
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
              <StyledDropzone />
            </div>
            <div className="mt-8 flex justify-between items-center ">
              <label htmlFor="title" className="text-md font-semibold  ">
                Redirect to another URL{" "}
              </label>
              <Toggle
                className=" px-3 py-2 "
                id="featured"

                // defaultChecked={formData.featured}
                // onChange={handleCheeseChange}
              />
            </div>
            <p className="text-gray-400 text-sm mt-2">
              When your campaign will be finished user can be redirected to link
              or website
            </p>
            <div className="mt-2 flex flex-col ">
              <label htmlFor="title" className="text-md font-semibold py-3 ">
                Redirect link{" "}
              </label>
              <input
                type="text"
                name=""
                id=""
                className="bg-white px-2 py-2 outline-none border border-gray-200 rounded-md"
                placeholder="Enter Link"
              />
            </div>
            <div className="border border-gray-300 my-6"></div>
            <div className="mt-8 flex justify-between items-center ">
              <label htmlFor="title" className="text-md font-semibold  ">
                Whitelist setup{" "}
              </label>
              <Toggle
                className=" px-3 py-2 "
                id="featured"

                // defaultChecked={formData.featured}
                // onChange={handleCheeseChange}
              />
            </div>
            <p className="text-gray-400 text-sm mt-2">
              Only addresses entered below will be able to claim
            </p>
            <div className="mt-2 flex flex-col ">
              <label htmlFor="title" className="text-md font-semibold py-3 ">
                Recepient’s address{" "}
              </label>
              <div className="bg-white line-clamp-3 px-2 py-2 outline-none border text-gray-500 border-gray-200 rounded-md">
                {val}
              </div>
            </div>
            <div className="mt-2 flex flex-col ">
              <label htmlFor="title" className="text-md font-semibold py-3 ">
                Upload CSV
              </label>
              <StyledDropzone />
            </div>
          </form>
          <button className="px-6 py-3 w-full md:w-auto mt-6 bg-[#5542F6] text-white rounded-md text-sm">
            Apply changes
          </button>
        </div>
      </div>
      <div className="w-1/3 md:inline hidden bg-white p-6">
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

export default CreateDispenser;
