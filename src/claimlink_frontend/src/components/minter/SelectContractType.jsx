import React, { useState } from "react";
import { CiImageOn, CiWallet } from "react-icons/ci";
import { IoImagesOutline } from "react-icons/io5";
import { TbInfoHexagon } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import gallery from "../../assets/svg/gallery.svg";
import StepperComponent from "../../common/StepperComponent";
import MainButton from "../../common/Buttons";
const SelectContractType = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 2));
    navigate("/minter/new-contract/collection-setup", {
      state: { currentStep: currentStep + 1 },
    });
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };
  const steps = [
    { id: 1, name: "Select contract type" },
    { id: 2, name: "Contract setup" },
  ];

  return (
    <>
      {" "}
      <StepperComponent
        steps={steps}
        currentStep={currentStep}
        completedColor="green-500"
        activeColor="blue-500"
        defaultColor="gray-300"
      />
      <div className="p-6 md:w-3/5 w-full">
        <div>
          <h2 className="text-xl font-bold text-[#2E2C34]">
            Select contract type
          </h2>
        </div>
        <div>
          <form action="" className="">
            <div className="mt-6 flex flex-col bg-white md:py-4 py-4 rounded-xl  px-4 cursor-pointer border border-[#EBEAED]">
              <svg
                className="mb-4  w-9 h-9 "
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="6.66797"
                  y="6.66675"
                  width="24"
                  height="24"
                  rx="4.2"
                  stroke="#564BF1"
                  stroke-width="1.5"
                />
                <path
                  d="M2.66797 7.46675C2.66797 4.81578 4.817 2.66675 7.46797 2.66675H21.868C24.5189 2.66675 26.668 4.81578 26.668 7.46675V21.8667C26.668 24.5177 24.5189 26.6667 21.868 26.6667H7.46797C4.817 26.6667 2.66797 24.5177 2.66797 21.8667V7.46675Z"
                  fill="white"
                />
                <path
                  d="M13.468 10.4667C13.468 12.1236 12.1248 13.4667 10.468 13.4667C8.81111 13.4667 7.46797 12.1236 7.46797 10.4667C7.46797 8.80989 8.81111 7.46675 10.468 7.46675C12.1248 7.46675 13.468 8.80989 13.468 10.4667Z"
                  fill="white"
                />
                <path
                  d="M26.668 17.0667L23.1412 14.5274C21.3085 13.208 18.804 13.3443 17.1255 14.855L12.2105 19.2785C10.5319 20.7892 8.0274 20.9255 6.19478 19.6061L2.66797 17.0667M7.46797 26.6667H21.868C24.5189 26.6667 26.668 24.5177 26.668 21.8667V7.46675C26.668 4.81578 24.5189 2.66675 21.868 2.66675H7.46797C4.817 2.66675 2.66797 4.81578 2.66797 7.46675V21.8667C2.66797 24.5177 4.817 26.6667 7.46797 26.6667ZM13.468 10.4667C13.468 12.1236 12.1248 13.4667 10.468 13.4667C8.81111 13.4667 7.46797 12.1236 7.46797 10.4667C7.46797 8.80989 8.81111 7.46675 10.468 7.46675C12.1248 7.46675 13.468 8.80989 13.468 10.4667Z"
                  stroke="#564BF1"
                  stroke-width="1.5"
                  stroke-linecap="round"
                />
              </svg>

              <h4 className="text-base text-[#2E2C34] font-bold">ERC-1155</h4>
              <p className="text-sm text-[#84818A] mt-1">
                Multiple copies of token with a common image. The most versatile
                selection for most marketing goals.
              </p>
            </div>
            <div className="flex md:flex-row flex-col w-full md:gap-4">
              <div className="mt-6 w-full md:w-1/2 flex flex-col bg-white md:py-4 py-4 rounded-xl  border border-[#EBEAED] px-4 cursor-pointer">
                <svg
                  className="mb-4  w-9 h-9 "
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M29.3346 18.6667L25.416 15.8453C23.3797 14.3792 20.5969 14.5307 18.7319 16.2092L13.2708 21.1242C11.4057 22.8028 8.6229 22.9543 6.58664 21.4882L2.66797 18.6667M8.0013 29.3334H24.0013C26.9468 29.3334 29.3346 26.9456 29.3346 24.0001V8.00008C29.3346 5.05456 26.9468 2.66675 24.0013 2.66675H8.0013C5.05578 2.66675 2.66797 5.05456 2.66797 8.00008V24.0001C2.66797 26.9456 5.05578 29.3334 8.0013 29.3334ZM14.668 11.3334C14.668 13.1744 13.1756 14.6667 11.3346 14.6667C9.49369 14.6667 8.0013 13.1744 8.0013 11.3334C8.0013 9.49247 9.49369 8.00008 11.3346 8.00008C13.1756 8.00008 14.668 9.49247 14.668 11.3334Z"
                    stroke="#564BF1"
                    stroke-width="1.5"
                    stroke-linecap="round"
                  />
                </svg>{" "}
                <h4 className="text-base text-[#2E2C34] font-bold">ICRC-7</h4>
                <p className="text-sm text-[#84818A] mt-1">
                  Unique tokens with individual images. Currently available
                  manually by request
                </p>
              </div>
              <div className="mt-6 w-full md:w-1/2  flex flex-col bg-white md:py-4 py-4 rounded-xl  px-4 cursor-pointer border border-[#EBEAED]">
                <svg
                  className="mb-4  w-9 h-9 "
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2.66797 9.33333C2.66797 6.38781 5.05578 4 8.0013 4H24.0013C26.9468 4 29.3346 6.38781 29.3346 9.33333V22.6667C29.3346 25.6122 26.9468 28 24.0013 28H8.0013C5.05578 28 2.66797 25.6122 2.66797 22.6667V9.33333Z"
                    stroke="#564BF1"
                    stroke-width="1.5"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M29.3333 12L29.3333 20H24C21.7909 20 20 18.2091 20 16C20 13.7909 21.7909 12 24 12L29.3333 12Z"
                    stroke="#564BF1"
                    stroke-width="1.5"
                    stroke-linejoin="round"
                  />
                </svg>{" "}
                <h4 className="text-base text-[#2E2C34] font-bold">IRC-20</h4>
                <p className="text-sm text-[#84818A] mt-1">
                  Assets with no media, consider USDT as an example. Currently
                  available manually by request
                </p>
              </div>
            </div>
          </form>
          <MainButton onClick={handleNext} text={"Next"} />
        </div>
      </div>
    </>
  );
};

export default SelectContractType;
