import React from "react";
import { CiImageOn } from "react-icons/ci";
import { CiWallet } from "react-icons/ci";
import Summary from "./Summary";
import { BsArrowLeft } from "react-icons/bs";
import { motion } from "framer-motion";
import Stepper from "../../common/Stepper";

const ClaimPattern = () => {
  return (
    <>
    <Stepper currentStep={2}/>
      <motion.div
        initial={{ opacity: 0.5, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between">
          <div className="h-screen  sm:w-[70%] w-full  p-6 ">
            <div className="flex gap-4  sm:hidden items-center">
              <div
                className="bg-[#564bf136] p-3  rounded-md"
                onClick={() => navigate(-1)}
              >
                <BsArrowLeft className="text-[#564BF1] w-6 h-6 font-semibold" />
              </div>
              <div>
                <p className="font-medium text-lg">Test campaign</p>
                <p className="text-gray-500">16.04.2024 20:55</p>
              </div>
            </div>
            <p className="text-2xl text-gray-900 font-semibold">
              claim pattern
            </p>
            <p className="text-gray-500 mt-4 ">
              Choose the desired claim pattern and proceed with the appropriate
              transaction to enable it
            </p>
            <div className="sm:w-[75%] w-full space-y-3 mt-8">
              <div className="sm:flex sm:gap-4 space-y-4  sm:space-y-0  ">
                <div className="sm:w-[50%] w-full rounded-md h-44 border-2 border-gray-100   p-4 bg-white ">
                  <CiImageOn size={36} className="text-[#5542F6]" />
                  <div>
                    <p className="font-semibold mt-10">Transfer</p>
                    <p className="text-sm text-gray-500">
                      Transfer should be preminted and will be transfered to
                      user at claim
                    </p>
                  </div>
                </div>
                <div className=" sm:w-[50%] w-full rounded-md h-44 border-2 border-gray-100  p-4 bg-white">
                  <CiWallet size={36} className="text-[#5542F6]" />
                  <div>
                    <p className="font-semibold mt-10">Mint</p>
                    <p className="text-sm text-gray-500">
                      Tokens will be minted to user address at claim
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 flex  space-x-3 ">
              <button className="px-4 py-3  sm:w-[20%] w-1/2 border-[#5542F6]  border text-[#5542F6]   text-sm font-quicksand  rounded transition  duration-200   ">
                Back
              </button>
              <button className="px-4 py-3  sm:w-[20%]  w-1/2 bg-[#5542F6]  text-sm font-quicksand  rounded transition  duration-200 hover:bg-blue-600 text-white">
                Next
              </button>
            </div>
          </div>
          <Summary />
        </div>
      </motion.div>
    </>
  );
};

export default ClaimPattern;
