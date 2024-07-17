import React, { useState } from "react";
import { CiImageOn, CiWallet } from "react-icons/ci";
import Summary from "./Summary";
import { BsArrowLeft } from "react-icons/bs";
import { motion } from "framer-motion";
import MainButton, { BackButton } from "../../common/Buttons";

const ClaimPattern = ({ handleNext, handleBack }) => {
  const [selectedPattern, setSelectedPattern] = useState("transfer");
  const [formData, setFormData] = useState({
    title: "",
    contract: "",
    collection: "",
    pattern: "transfer",
  });
  const [errors, setErrors] = useState({});

  const handlePatternSelect = (patternType) => {
    setSelectedPattern(patternType);
    setFormData({ ...formData, pattern: patternType });
  };

  const validate = () => {
    let tempErrors = {};
    tempErrors.pattern = formData.pattern ? "" : "Claim pattern is required.";
    setErrors(tempErrors);
    return Object.values(tempErrors).every((x) => x === "");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      // Handle form submission
      console.log("Form submitted", formData);
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
      >
        <form onSubmit={handleSubmit}>
          <div className="flex justify-between">
            <div className="h-screen sm:w-[70%] w-full p-6">
              <div className="flex gap-4 sm:hidden items-center mb-8">
                <div
                  className="bg-[#564bf136] p-3 rounded-md"
                  onClick={handleBack}
                >
                  <BsArrowLeft className="text-[#564BF1] w-6 h-6 font-semibold" />
                </div>
                <div>
                  <p className="font-medium text-lg">Test campaign</p>
                  <p className="text-gray-500">16.04.2024 20:55</p>
                </div>
              </div>
              <p className="text-2xl text-gray-900 font-semibold">
                Claim pattern
              </p>
              <p className="text-gray-500 mt-4">
                Choose the desired claim pattern and proceed with the
                appropriate transaction to enable it
              </p>
              <div className="sm:w-[75%] w-full space-y-3 mt-8">
                <div className="sm:flex sm:gap-4 space-y-4 sm:space-y-0">
                  <div
                    className={`sm:w-[50%] w-full rounded-md h-48 border-2 border-gray-100 p-4 cursor-pointer ${
                      selectedPattern === "transfer"
                        ? "bg-[#5542F6]"
                        : " bg-white"
                    }`}
                    onClick={() => handlePatternSelect("transfer")}
                  >
                    <CiImageOn
                      size={36}
                      className={`${
                        selectedPattern === "transfer"
                          ? "text-white"
                          : "text-[#5542F6]"
                      }`}
                    />
                    <div>
                      <p
                        className={`font-semibold mt-10 ${
                          selectedPattern === "transfer" ? "text-white" : ""
                        }`}
                      >
                        Transfer
                      </p>
                      <p
                        className={`text-sm ${
                          selectedPattern === "transfer"
                            ? "text-gray-200"
                            : "text-gray-500"
                        }`}
                      >
                        Transfer should be preminted and will be transferred to
                        user at claim
                      </p>
                    </div>
                  </div>
                  <div
                    className={`sm:w-[50%] w-full rounded-md h-48 border-2 border-gray-100 p-4 cursor-pointer ${
                      selectedPattern === "mint" ? "bg-[#5542F6]" : " bg-white"
                    }`}
                    onClick={() => handlePatternSelect("mint")}
                  >
                    <CiWallet
                      size={36}
                      className={`${
                        selectedPattern === "mint"
                          ? "text-white"
                          : "text-[#5542F6]"
                      }`}
                    />
                    <div>
                      <p
                        className={`font-semibold mt-10 ${
                          selectedPattern === "mint" ? "text-white" : ""
                        }`}
                      >
                        Mint
                      </p>
                      <p
                        className={`text-sm ${
                          selectedPattern === "mint"
                            ? "text-gray-200"
                            : "text-gray-500"
                        }`}
                      >
                        Tokens will be minted to user address at claim
                      </p>
                    </div>
                  </div>
                </div>
                {errors.pattern && (
                  <p className="text-red-500 text-sm">{errors.pattern}</p>
                )}
              </div>
              <div className="mt-6 flex space-x-3">
                <BackButton text={"Back"} onClick={handleBack} />
                <MainButton text={"Next"} type="submit" />
              </div>
            </div>
            <Summary />
          </div>
        </form>
      </motion.div>
    </>
  );
};

export default ClaimPattern;
