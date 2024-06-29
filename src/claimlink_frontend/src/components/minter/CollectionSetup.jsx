import { motion } from "framer-motion";
import React, { useMemo } from "react";
import { TbInfoHexagon } from "react-icons/tb";
import { TfiPlus } from "react-icons/tfi";
import StyledDropzone from "../../common/StyledDropzone";
import Toggle from "react-toggle";
import { GoDownload } from "react-icons/go";
import { BsCopy, BsQrCode } from "react-icons/bs";
import { MobileHeader } from "../../common/Header";
import { useLocation, useNavigate } from "react-router-dom";
import StepperComponent from "../../common/StepperComponent";
import MainButton, { BackButton } from "../../common/Buttons";

const CollectionSetup = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { currentStep } = location.state || { currentStep: 1 };

  const handleBack = () => {
    navigate("/minter/new-contract", {
      state: { currentStep: currentStep - 1 },
    });
  };

  const steps = [
    { id: 1, name: "Select contract type" },
    { id: 2, name: "Contract setup" },
  ];
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
        initial={{ scale: 1, opacity: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{}}
        className="flex"
      >
        <div className="p-6 w-full md:w-3/5">
          <div>
            <div className="flex md:hidden justify-start">
              <MobileHeader htext={"New Contract"} />
            </div>
            <h2 className="text-xl md:mt-0 mt-4 font-bold text-[#2E2C34]">
              Collection setup{" "}
            </h2>
          </div>
          <div>
            <form action="">
              <div className=" flex flex-col md:mt-4 mt-2 ">
                <label
                  htmlFor="title"
                  className="text-base text-[#2E2C34] font-semibold py-3 "
                >
                  Collection title{" "}
                  <span className="text-gray-400 text-base mb-3 font-normal ">
                    (max 200 symbols)
                  </span>
                </label>
                <input
                  type="text"
                  name=""
                  id=""
                  className="bg-white px-2 py-2 outline-none border border-[#EBEAED] rounded-md"
                  placeholder="text"
                />
              </div>
              <div className=" flex flex-col ">
                <label
                  htmlFor="title"
                  className="text-base text-[#2E2C34] font-semibold py-3 "
                >
                  Collection symbol{" "}
                  <span className="text-gray-400 text-base mb-3 font-normal">
                    (optional, max 5 symbols, etc. SYMBL, TKN)
                  </span>
                </label>
                <input
                  type="text"
                  name=""
                  id=""
                  className="bg-white px-2 py-2 outline-none border border-[#EBEAED] rounded-md"
                  placeholder="text"
                />
                <div className="flex items-center gap-4 mt-3 ">
                  <TbInfoHexagon className="text-[#564BF1]" />
                  <p className="text-sm text-[#84818A]">
                    If you don’t know what a symbol is, keep it blank, and we
                    will use the auto-generated one based on title
                  </p>
                </div>
              </div>
              <div className="mt-2 flex flex-col ">
                <label
                  htmlFor="title"
                  className="text-base text-[#2E2C34] font-semibold py-3 "
                >
                  Collection thumbnail{" "}
                  <span className="text-gray-400 text-base mb-3 font-normal">
                    (PNG, JPG, GIF, MP4. Max 5MB)
                  </span>
                </label>
                <div className="flex gap-4 flex-col md:flex-row">
                  <img
                    className="rounded-xl  md:w-22 md:h-24 w-28"
                    src="https://images.pexels.com/photos/3621234/pexels-photo-3621234.jpeg?auto=compress&cs=tinysrgb&w=600"
                    alt=""
                  />
                  <StyledDropzone />
                </div>
              </div>
            </form>
            <div className="flex gap-4 md:w-auto w-full md:mt-0 mt-10">
              <BackButton onClick={handleBack} text={"Back"} />

              <MainButton text={" Deploy collection"} />
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default CollectionSetup;
