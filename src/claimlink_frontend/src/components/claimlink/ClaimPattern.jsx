import React, { useState, useEffect } from "react";
import { BsArrowLeft } from "react-icons/bs";
import Summary from "./Summary";
import { motion } from "framer-motion";
import MainButton, { BackButton } from "../../common/Buttons";
import { CiImageOn, CiWallet } from "react-icons/ci";

const ClaimPattern = ({ handleNext, handleBack, formData, setFormData }) => {
  const [errors, setErrors] = useState({});

  // useEffect(() => {
  //   if (formData.contract === "tokens") {
  //     setFormData((prevData) => ({
  //       ...prevData,
  //       pattern: "transfer",
  //     }));
  //   } else if (formData.contract === "nfts") {
  //     setFormData((prevData) => ({
  //       ...prevData,
  //       pattern: "mint",
  //     }));
  //   }
  // }, [formData.contract, setFormData]);

  const validate = () => {
    let tempErrors = {};
    tempErrors.pattern = formData.pattern ? "" : "Pattern is required.";
    setErrors(tempErrors);
    return Object.values(tempErrors).every((x) => x === "");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      handleNext();
    }
  };

  const pageVariants = {
    initial: { opacity: 0, x: "-100vw" },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: "100vw" },
  };

  const pageTransition = { type: "tween", ease: "anticipate", duration: 0.8 };

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      <form onSubmit={handleSubmit}>
        <div className="flex justify-between">
          <div className="h-full sm:w-[70%] w-screen space-y-6 p-6">
            <div className="flex sm:hidden gap-4 items-center">
              <div
                className="bg-[#564bf136] p-3 rounded-md cursor-pointer"
                onClick={handleBack}
              >
                <BsArrowLeft className="text-[#564BF1] w-6 h-6 font-semibold" />
              </div>
              <div>
                <p className="font-medium text-lg">Test</p>
                <p className="text-gray-500">16.04.2024 20:55</p>
              </div>
            </div>
            <p className="text-2xl text-gray-900 font-semibold">
              Claim Pattern
            </p>

            <div className="sm:w-[75%] w-full space-y-3 mt-8">
              <div className="sm:flex sm:gap-4 space-y-4 sm:space-y-0">
                <div
                  className={`sm:w-[50%] w-full rounded-md h-48 border-2 border-gray-100 p-4 cursor-pointer ${
                    formData.pattern === "transfer"
                      ? "bg-[#5542F6]"
                      : "bg-white"
                  }  `}
                  onClick={() =>
                    setFormData({ ...formData, pattern: "transfer" })
                  }
                >
                  <CiImageOn
                    size={36}
                    className={`${
                      formData.pattern === "transfer"
                        ? "text-white"
                        : "text-[#5542F6]"
                    }`}
                  />
                  <div>
                    <p
                      className={`font-semibold mt-10 ${
                        formData.pattern === "transfer" ? "text-white" : ""
                      }`}
                    >
                      Transfer
                    </p>
                    <p
                      className={`text-sm ${
                        formData.pattern === "transfer"
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
                    formData.pattern === "mint" ? "bg-[#5542F6]" : "bg-white"
                  } `}
                  onClick={() => setFormData({ ...formData, pattern: "mint" })}
                >
                  <CiWallet
                    size={36}
                    className={`${
                      formData.pattern === "mint"
                        ? "text-white"
                        : "text-[#5542F6]"
                    }`}
                  />
                  <div>
                    <p
                      className={`font-semibold mt-10 ${
                        formData.pattern === "mint" ? "text-white" : ""
                      }`}
                    >
                      Mint
                    </p>
                    <p
                      className={`text-sm ${
                        formData.pattern === "mint"
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
              <BackButton text="back" type="button" onClick={handleBack} />
              <MainButton text="Continue" type="submit" />
            </div>
          </div>

          <div className="hidden sm:flex w-[30%] h-full bg-white">
            <Summary formData={formData} />
          </div>
        </div>
      </form>
    </motion.div>
  );
};

export default ClaimPattern;
