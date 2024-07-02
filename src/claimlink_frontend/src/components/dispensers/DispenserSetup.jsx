import React, { useState } from "react";
import { TbInfoHexagon } from "react-icons/tb";
import { motion } from "framer-motion";
import StepperComponent from "../../common/StepperComponent";

const DispenserSetup = () => {
  const [currentStep, setCurrentStep] = useState(1);

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 2));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const steps = [{ id: 1, name: "Dispenser setup" }];

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
      <StepperComponent
        steps={steps}
        currentStep={currentStep}
        completedColor="green-500"
        activeColor="blue-500"
        defaultColor="gray-300"
      />
      <motion.div
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
        className="md:p-6 p-4 md:w-2/3 w-full"
      >
        <div>
          <h2 className="text-xl font-semibold">Dispenser setup</h2>
        </div>
        <div>
          <form action="">
            <div className="mt-6 flex flex-col">
              <label htmlFor="title" className="text-lg font-semibold py-3">
                Title
              </label>
              <input
                type="text"
                name="title"
                id="title"
                className="bg-white px-2 py-2 outline-none border border-gray-200 rounded-md"
                placeholder="Text"
              />
            </div>
            <div className="mt-2 flex flex-col">
              <label htmlFor="startDate" className="text-lg font-semibold py-3">
                Start date
              </label>
              <div className="flex md:flex-row flex-col w-full justify-between gap-4">
                <input
                  type="date"
                  name="startDate"
                  id="startDate"
                  className="bg-white px-2 py-2 outline-none border border-gray-200 rounded-md w-full"
                />
                <div className="flex md:justify-normal justify-between gap-4">
                  <select
                    name="startHour"
                    id="startHour"
                    className="bg-white w-full px-2 py-2 outline-none border border-gray-200 rounded-md"
                  >
                    <option value="">12</option>
                    <option value="">13</option>
                    <option value="">14</option>
                  </select>
                  <select
                    name="startMinute"
                    id="startMinute"
                    className="bg-white w-full px-2 py-2 outline-none border border-gray-200 rounded-md"
                  >
                    <option value="">11</option>
                    <option value="">12</option>
                    <option value="">13</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-2">
                <TbInfoHexagon className="text-[#564BF1]" />
                <p className="text-sm text-gray-500">
                  Enter start date in the DD-MM-YYYY format, e.g. 11-04-2022
                </p>
              </div>
            </div>
            <div className="mt-2 flex flex-col">
              <label htmlFor="duration" className="text-lg font-semibold py-3">
                Duration
              </label>
              <input
                type="text"
                name="duration"
                id="duration"
                className="bg-white px-2 py-2 outline-none border border-gray-200 rounded-md"
                placeholder="Text"
              />
              <div className="flex items-center gap-4 mt-2">
                <TbInfoHexagon className="text-[#564BF1]" />
                <p className="text-sm text-gray-500">
                  Enter duration in minutes
                </p>
              </div>
            </div>
          </form>
          <button
            onClick={handleNext}
            className="px-6 w-full md:w-auto py-2 mt-6 bg-[#5542F6] text-white rounded-sm text-sm"
          >
            Create
          </button>
        </div>
      </motion.div>
    </>
  );
};

export default DispenserSetup;
