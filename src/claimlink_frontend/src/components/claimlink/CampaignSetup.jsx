import React, { useState } from "react";
import { CiImageOn } from "react-icons/ci";
import { CiWallet } from "react-icons/ci";
import Summary from "./Summary";
import Stepper from "../../common/Stepper";
import { Link } from "react-router-dom";
<<<<<<< HEAD
import { BsArrowLeft } from "react-icons/bs";
import { motion } from "framer-motion";
=======
import StepperComponent from "../../common/StepperComponent";
>>>>>>> d4a69e9 (AddED)

const CampaignSetup = () => {
  const [currentStep, setCurrentStep] = useState(1);

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 4)); // Assuming there are 4 steps
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };
  const steps = [
    { id: 1, name: "Campaign setup" },
    { id: 2, name: "Claim pattern" },
    { id: 3, name: "Distribution" },
    { id: 4, name: "Launch" },
  ];
  return (
    <>
<<<<<<< HEAD
      <Stepper currentStep={1} />
      <motion.div
        initial={{ opacity: 0.5, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between">
          <div className="h-screen   sm:w-[70%] w-screen space-y-6 p-6 ">
            <div className="flex sm:hidden gap-4 items-center">
              <div
                className="bg-[#564bf136] p-3 rounded-md"
                onClick={() => navigate(-1)}
              >
                <BsArrowLeft className="text-[#564BF1] w-6 h-6 font-semibold" />
=======
      <StepperComponent
        steps={steps}
        currentStep={currentStep}
        completedColor="green-500"
        activeColor="blue-500"
        defaultColor="gray-300"
      />
      <div className="flex justify-between">
        <div className="h-screen  sm:w-[70%] w-screen space-y-6 p-6 ">
          <p className="text-2xl text-gray-900 font-semibold">campaign setup</p>

          <div className="space-y-3">
            <p className="text-gray-900 font-semibold">Title</p>
            <input
              type="text"
              className="sm:w-[75%] w-full h-10 rounded border-2 px-3 border-gray-100"
              placeholder="Text "
            />
          </div>
          <div className="sm:w-[75%] w-full space-y-3">
            <p className="text-gray-900 font-semibold">contract</p>
            <div className="sm:flex sm:gap-4 ">
              <div className="sm:w-[50%] rounded-md mb-4 sm:mb-0 h-36 border-2 border-gray-100 space-y-6 p-4 bg-white ">
                <CiImageOn size={36} className="text-[#5542F6]" />
                <div>
                  <p className="font-semibold"> NFTs </p>
                  <p className="text-sm text-gray-500">DIP-721/ICRC-7</p>
                </div>
>>>>>>> d4a69e9 (AddED)
              </div>
              <div>
                <p className="font-medium text-lg">Test</p>
                <p className="text-gray-500">16.04.2024 20:55</p>
              </div>
            </div>
            <p className="text-2xl text-gray-900 font-semibold">
              campaign setup
            </p>

            <div className="space-y-3">
              <p className="text-gray-900 font-semibold">Title</p>
              <input
                type="text"
                className="sm:w-[75%] w-full h-10 rounded border-2 px-3 outline-none border-gray-100"
                placeholder="Text "
              />
            </div>
            <div className="sm:w-[75%] w-full space-y-3">
              <p className="text-gray-900 font-semibold">contract</p>
              <div className="sm:flex sm:gap-4 ">
                <div className="sm:w-[50%] rounded-md mb-4 sm:mb-0 h-36 border-2 border-gray-100 space-y-6 p-4 bg-white ">
                  <CiImageOn size={36} className="text-[#5542F6]" />
                  <div>
                    <p className="font-semibold"> NFTs </p>
                    <p className="text-sm text-gray-500">DIP-721/ICRC-7</p>
                  </div>
                </div>
                <div className="sm:w-[50%] rounded-md h-36 border-2 border-gray-100 space-y-6 p-4 bg-white">
                  <CiWallet size={36} className="text-[#5542F6]" />
                  <div>
                    <p className="font-semibold"> Tokens</p>
                    <p className="text-sm text-gray-500">ERC 20</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-3 sm:w-[75%] w-full">
              <p className="text-gray-900 font-semibold">Choose collection</p>
              <input
                type="text"
                className=" w-full h-10 rounded border-2 px-3 outline-none border-gray-100"
                placeholder="Text "
              />
              <p className="flex items-center sm:w-1/4 w-1/3  justify-center text-gray-500 font-semibold text-xs   rounded-3xl bg-gray-200 px-3 py-1">
                My last collection
              </p>
            </div>

            <button
              className="px-4 py-3 sm:w-[18%] w-full bg-[#5542F6]  text-xs font-quicksand  rounded transition  duration-200 hover:bg-blue-600 text-white"
              onClick={handleNext}
              disabled={currentStep === 4}
            >
              <Link to="/claim-pattern">Next</Link>
            </button>
          </div>
          <Summary />
        </div>
      </motion.div>
    </>
  );
};

export default CampaignSetup;
