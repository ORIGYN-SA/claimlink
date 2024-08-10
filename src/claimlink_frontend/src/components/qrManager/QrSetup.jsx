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
  const [errors, setErrors] = useState({});
  // State to store campaign IDs

  
  

 

  const validateForm = () => {
    const newErrors = {};

    if (!formData.setName) {
      newErrors.setName = "Name of the set is required.";
    }

    if (!formData.quality) {
      newErrors.quality = "Quality is required.";
    }

    

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedFormData = {
      ...formData,
      [name]: value,
    };

    setFormData(updatedFormData);

    if (name === "setName") {
      setName(value);
    }

    if (name === "quality") {
      setQuantity(value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Handle form submission
      createQR();
      console.log(formData);
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
              />
              {errors.setName && (
                <p className="text-red-500 text-sm mt-1">{errors.setName}</p>
              )}
            </div>
            <div className="space-y-3 mt-6">
              <p className="text-gray-900 font-semibold">Quantity</p>
              <input
                type="number"
                name="quality"
                className="sm:w-[50%] h-10 w-full outline-none rounded border-2 px-3 border-gray-100"
                placeholder="number"
                value={formData.quality}
                onChange={handleChange}
              />
              {errors.quality && (
                <p className="text-red-500 text-sm mt-1">{errors.quality}</p>
              )}
            </div>
             
              
              
         
            <button
              type="submit"
              onClick={handleNext}
              className="px-4 py-3 mt-8 sm:w-[12.5%] w-full bg-[#5542F6] text-xs font-quicksand rounded transition duration-200 hover:bg-blue-600 text-white"
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
