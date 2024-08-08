import { motion } from "framer-motion";
import React, { useState, useEffect } from "react";
import StepperComponent from "../../common/StepperComponent";
import { useAuth } from "../../connect/useClient";
import toast from "react-hot-toast";

const QrSetup = () => {
  const steps = [{ id: 1, name: "QR setup" }];
  const [currentStep, setCurrentStep] = useState(1);
  const { backend } = useAuth();
  const [formData, setFormData] = useState({
    setName: "",
    quality: "",
    campaignId: "", // Added campaignId in formData
  });
  const [errors, setErrors] = useState({});
  const [campaignIds, setCampaignIds] = useState([]); // State to store campaign IDs

  const handleNext = () => {
    if (validateForm()) {
      setCurrentStep((prev) => Math.min(prev + 1, 2));
    }
  };

  const createQR = async () => {
    try {
      const res = await backend.createQRSet(
        formData.setName,
        parseInt(formData.quality),
        formData.campaignId
      );

      if (res) {
        toast.success("Successfully created");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getCampaignId = async () => {
    try {
      const res = await backend.getUserCampaigns();
      const ids = res[0].map((campaign) => campaign.id); // Assuming each campaign object has an `id` field
      setCampaignIds(ids);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCampaignId();
  }, [backend]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.setName) {
      newErrors.setName = "Name of the set is required.";
    }

    if (!formData.quality) {
      newErrors.quality = "Quality is required.";
    }

    if (!formData.campaignId) {
      newErrors.campaignId = "Campaign ID is required.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
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
            <div className="space-y-3 mt-6">
              <p className="text-gray-900 font-semibold">Select Campaign ID</p>
              <select
                name="campaignId"
                className="sm:w-[50%] h-10 w-full outline-none rounded border-2 px-3 border-gray-100"
                value={formData.campaignId}
                onChange={handleChange}
              >
                <option value="">Select a campaign</option>
                {campaignIds.map((id) => (
                  <option key={id} value={id}>
                    {id}
                  </option>
                ))}
              </select>
              {errors.campaignId && (
                <p className="text-red-500 text-sm mt-1">{errors.campaignId}</p>
              )}
            </div>
            <button
              type="submit"
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
