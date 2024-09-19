import { motion } from "framer-motion";
import React, { useState, useEffect } from "react";
import StepperComponent from "../../common/StepperComponent";
import { useAuth } from "../../connect/useClient";
import toast from "react-hot-toast";

const QrSetup = ({ handleNext, setName, setQuantity }) => {
  const steps = [{ id: 1, name: "QR setup" }];
  const [currentStep, setCurrentStep] = useState(1);
  const { backend } = useAuth();

  const [formData, setFormData] = useState({
    setName: "",
    quality: "",
    // Added campaignId in formData
  });

  const [error, setError] = useState(""); // State for error message

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedFormData = {
      ...formData,
      [name]: value,
    };

    setFormData(updatedFormData);
    setError(""); // Clear error message when user starts typing

    if (name === "setName") {
      setName(value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if the setName field is empty
    if (!formData.setName) {
      setError("Name of the set is required");
      return;
    }

    // Proceed to the next step
    handleNext();
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
        className="p-6"
      >
        <div className="h-screen">
          <p className="text-2xl text-gray-900 font-semibold">New QR set</p>
          <form onSubmit={handleSubmit}>
            <div className="space-y-3 mt-6">
              <p className="text-gray-900 font-semibold">Name of the set</p>
              <input
                type="text"
                name="setName"
                className="sm:w-[50%] w-full h-10 rounded outline-none border-2 px-3 border-gray-100"
                placeholder="Text"
                value={formData.setName}
                onChange={handleChange}
                required
              />
              {/* Error message display */}
              {error && (
                <p className="text-red-500 text-sm font-semibold">{error}</p>
              )}
            </div>

            <button
              type="submit"
              className={`px-4 py-3 mt-8 sm:w-[12.5%] w-full bg-[#5542F6] text-xs font-quicksand rounded transition duration-200 text-white  `}
            >
              Next
            </button>
          </form>
        </div>
      </motion.div>
    </>
  );
};

export default QrSetup;
