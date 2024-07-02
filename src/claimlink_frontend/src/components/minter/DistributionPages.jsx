import { motion } from "framer-motion";
import React, { useMemo, useState } from "react";
import { TbInfoHexagon } from "react-icons/tb";
import { TfiPlus } from "react-icons/tfi";
import StyledDropzone from "../../common/StyledDropzone";
import Toggle from "react-toggle";
import { GoDownload, GoLink } from "react-icons/go";
import { BsCopy, BsPlusLg, BsQrCode } from "react-icons/bs";
import { IoSettingsOutline } from "react-icons/io5";
import { PiLinkSimple } from "react-icons/pi";
import ButtonMain, { BackButton } from "../../common/Buttons";
import MainButton from "../../common/Buttons";
import { RxCross2 } from "react-icons/rx";
import CommonModal from "../../common/CommonModel";
import { MobileHeader } from "../../common/Header";
import StepperComponent from "../../common/StepperComponent";
// import "react-toggle/style.css";

const DistributionPages = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = (e) => {
    e.preventDefault();
    setIsModalOpen(!isModalOpen);
  };
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
        className="flex"
      >
        <div className="p-6  w-full md:w-2/3">
          <div className="flex md:hidden justify-start">
            <MobileHeader htext={"New Contract"} />
          </div>
          <div>
            <h2 className="md:text-xl text-xl text-[#2E2C34] font-[700] md:mt-0 mt-6">
              Distrubution{" "}
            </h2>
            <p className="text-[#2E2C34] text-xs md:text-sm mt-2">
              Choose the desired claim pattern and proceed with the appropriate
              transaction to enable it
            </p>
          </div>
          <div className="mt-4">
            <form action="">
              <div className="mt-2 flex bg-white px-4 py-3 items-center rounded-lg gap-4 border border-[#EBEAED]">
                <IoSettingsOutline className="md:w-6 md:h-6 w-5 h-5 text-[#5542F6]" />
                <div className="">
                  <h4 className="font-bold md:text-base text-xs text-[#2E2C34]">
                    Manual
                  </h4>
                  <p className="md:text-sm text-xs text-[#84818A]">
                    Select tokens to generate links
                  </p>
                </div>
              </div>
              <div className="mt-2 flex bg-white px-4 py-3 items-center rounded-lg gap-4 border border-gray-200">
                <PiLinkSimple className="md:w-6 md:h-6 w-5 h-5 text-[#5542F6]" />
                <div className="">
                  <h4 className="font-[700] md:text-base text-xs text-[#2E2C34] ">
                    SDK
                  </h4>
                  <p className=" md:text-sm text-xs text-[#84818A]">
                    Set up and use our SDK to generate links on the fly
                  </p>
                </div>
              </div>
              <div className=" flex flex-col mt-4">
                <label
                  htmlFor="title"
                  className="md:text-base text-sm text-[#2E2C34] py-2 md:py-3 md:font-[700] font-[600]"
                >
                  Gasless claiming
                </label>
                <p className="md:text-sm text-xs text-[#84818A] mb-3 ">
                  Selecting to sponsor transactions will allow users to claim
                  tokens without having any MATIC in their wallets, otherwise
                  users will pay gas to cover transactions themselves
                </p>
                <div className="mt-2 flex bg-white px-4 py-2 md:py-3 items-center rounded-lg gap-4 border border-gray-200">
                  <svg
                    className="md:w-9 md:h-9 h-5 w-5 "
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M21.332 26.6667L23.9182 28.7356C24.3361 29.0699 24.9431 29.016 25.2955 28.6132L29.332 24"
                      stroke="#564BF1"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M29.332 18.6667V8H6.66536C4.45622 8 2.66536 9.79086 2.66536 12V25.3333C2.66536 27.5425 4.45623 29.3333 6.66536 29.3333H17.332"
                      stroke="#564BF1"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M29.332 6.66675C29.332 4.45761 27.5412 2.66675 25.332 2.66675H14.6654C12.4562 2.66675 10.6654 4.45761 10.6654 6.66675V8.00008H29.332V6.66675Z"
                      stroke="#564BF1"
                      stroke-width="1.5"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M2.66797 16L2.66797 21.3333L8.0013 21.3333C9.47406 21.3333 10.668 20.1394 10.668 18.6667V18.6667C10.668 17.1939 9.47406 16 8.0013 16L2.66797 16Z"
                      stroke="#564BF1"
                      stroke-width="1.5"
                      stroke-linejoin="round"
                    />
                  </svg>
                  <div className="">
                    <h4 className="font-[700] md:text-base text-xs text-[#2E2C34]">
                      Sponsor claiming gas fees (+ 0.3 MATIC per link)
                    </h4>
                  </div>
                </div>
                <div className="mt-2 flex bg-white px-4 py-2 md:py-3 items-center rounded-lg gap-4 border border-gray-200">
                  <svg
                    className="md:w-9 md:h-9 h-5 w-5 "
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M28.6686 23.6765L23.0118 29.3334M28.6686 29.3334L23.0118 23.6766"
                      stroke="#564BF1"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M29.332 18.6667V8H6.66536C4.45622 8 2.66536 9.79086 2.66536 12V25.3333C2.66536 27.5425 4.45623 29.3333 6.66536 29.3333H17.332"
                      stroke="#564BF1"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M29.332 6.66675C29.332 4.45761 27.5412 2.66675 25.332 2.66675H14.6654C12.4562 2.66675 10.6654 4.45761 10.6654 6.66675V8.00008H29.332V6.66675Z"
                      stroke="#564BF1"
                      stroke-width="1.5"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M2.66797 16L2.66797 21.3333L8.0013 21.3333C9.47406 21.3333 10.668 20.1394 10.668 18.6667V18.6667C10.668 17.1939 9.47406 16 8.0013 16L2.66797 16Z"
                      stroke="#564BF1"
                      stroke-width="1.5"
                      stroke-linejoin="round"
                    />
                  </svg>
                  <div className="">
                    <h4 className="font-[700] md:text-base text-xs text-[#2E2C34] ">
                      No sponsoring
                    </h4>
                  </div>
                </div>
              </div>
              <div>
                <div className="flex md:flex-row flex-col justify-between mb-2 mt-6">
                  <label
                    htmlFor="title"
                    className="md:text-base text-sm text-[#2E2C34] py-2 md:py-3 md:font-[700] font-[600]"
                  >
                    Add token IDs to distribute
                  </label>
                  <div className="flex mt-2 gap-3">
                    <p className="px-2 py-1 text-[#5542F6] text-sm rounded-lg bg-gray-300">
                      Pick token IDs
                    </p>
                    <p className="px-2 py-1 text-white text-sm rounded-lg bg-[#5542F6]">
                      Select all
                    </p>
                  </div>
                </div>
                <div className="flex w-full gap-4 items-center">
                  <input
                    type="text"
                    className="bg-white w-[30%]  px-2 py-2 outline-none border border-gray-200 rounded-md"
                    placeholder="Token ID"
                  />
                  <input
                    type="text"
                    className="bg-white w-[30%] px-2 py-2 outline-none border border-gray-200 rounded-md"
                    placeholder="Copies per link"
                  />
                  <input
                    type="text"
                    className="bg-white w-[30%] px-2 py-2 outline-none border border-gray-200 rounded-md"
                    placeholder="Number of links"
                  />
                  <div className=" bg-[#564bf123] text-[#564BF1] p-2 ">
                    <BsPlusLg className="p-1  w-5 h-5 rounded-md" />
                  </div>
                </div>
              </div>
              <div className=" flex flex-col mt-6 ">
                <div className="flex md:flex-row flex-col justify-between mb-2">
                  <label
                    htmlFor="title"
                    className="md:text-md text-sm text-[#2E2C34] py-2 md:py-3 md:font-[700] font-[600]"
                  >
                    Add token IDs to distribute
                  </label>
                  <div className="flex mt-2 gap-3">
                    <p className="px-2 py-1 text-[#5542F6] text-sm rounded-lg bg-gray-300">
                      Set manually
                    </p>
                    <p className="px-2 py-1 text-white text-sm rounded-lg bg-[#5542F6]">
                      select all
                    </p>
                  </div>
                </div>
                <select
                  name=""
                  id=""
                  className="bg-white px-2 py-2 outline-none border border-gray-200 rounded-md"
                >
                  <option value="">Choos campaign</option>
                  <option value="">My last campaign</option>
                  <option value="">My last campaign</option>
                </select>
              </div>

              <div className="mt-8">
                <div className="flex justify-around text-xs text-[#504F54]">
                  <p className="text-xs text-[#504F54]">Title</p>
                  <p>ID</p>
                  <p>Links</p>
                </div>
                {[1, 2, 3].map((index) => (
                  <div
                    key={index}
                    className="flex justify-between my-2 items-center rounded-md bg-white px-2 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        width="40px"
                        height="60px"
                        src="https://images.pexels.com/photos/3621234/pexels-photo-3621234.jpeg?auto=compress&cs=tinysrgb&w=600"
                        alt="Dispenser"
                        className="rounded-sm"
                      />
                      <div>
                        <h2 className="text-sm text-[#2E2C34] font-[600]">
                          Test collection
                        </h2>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-[#2E2C34]">0001</p>
                    </div>
                    <div className="flex gap-2 items-center">
                      <p className="text-sm text-[#2E2C34]">10</p>
                      <button
                        onClick={toggleModal}
                        className="text-[#3B00B9] px-2 py-1 text-sm bg-[#3b00b92d] rounded-md"
                      >
                        Edit quantity
                      </button>
                      <RxCross2 className="p-1 bg-[#FEECED] text-[#F95657] w-5 h-5 rounded-md" />
                    </div>
                  </div>
                ))}
                {isModalOpen && (
                  <>
                    <div
                      className="fixed inset-0 bg-[#7979792e] z-40"
                      onClick={toggleModal}
                    ></div>
                    <div className="fixed inset-0 flex items-center justify-center z-50">
                      <CommonModal
                        toggleModal={toggleModal}
                        title="Transfer NFT"
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="flex items-center gap-4 mt-2 ">
                <TbInfoHexagon className="text-[#564BF1] w-5 h-5" />
                <p className="md:text-sm text-xs text-[#84818A] mb-3 ">
                  If you have a big set of different tokens to distribute, you
                  couls also provide the information by{" "}
                  <span className="text-[#564BF1] font-[600]">
                    uploading CSV file
                  </span>
                </p>
              </div>
            </form>
            <div className="flex gap-4">
              <BackButton text={"Back"} />

              <MainButton text={"Approve"} />
            </div>
          </div>
        </div>
        <div className="w-1/3 md:block hidden bg-white p-6">
          <h2 className="font-semibold text-xl">Summary</h2>
          <p className="text-[#84818A] text-sm	">Check and confirm details</p>
          <div className="mt-6 w-full">
            <div className="flex justify-between">
              <p className="text-[#84818A] text-sm">Title of campaign</p>
              <p className="text-[#2E2C34] text-sm font-[700]">
                Links for ‘test token’
              </p>
            </div>
            <div className="flex justify-between mt-2">
              <p className="text-[#84818A] text-sm">Token address</p>
              <p className="text-[#564BF1] text-sm font-[700]">0xf8c...992h4</p>
            </div>
            <div className="flex justify-between mt-2">
              <p className="text-[#84818A] text-sm">Token name</p>
              <p className="text-[#2E2C34] text-sm font-[700]">ICRC-7 Token</p>
            </div>
            <div className="flex justify-between mt-2">
              <p className="text-[#84818A] text-sm">Token standart</p>
              <p className="text-[#2E2C34] text-sm font-[700]">ICRC-7</p>
            </div>
          </div>
          <div className="border border-gray-300 my-4"></div>
          <div className=" w-full">
            <div className="flex justify-between">
              <p className="text-[#84818A] text-sm">ID/Copies</p>
              <p className="text-[#2E2C34] text-sm font-[700]">
                1/1 per link / 10 links
              </p>
            </div>
          </div>
          <div className="border border-gray-300 my-4"></div>
          <div className=" w-full">
            <div className="flex justify-between mt-2">
              <p className="text-[#84818A] text-sm">Total links</p>
              <p className="text-[#2E2C34] text-sm font-[700]">10</p>
            </div>
            <div className="flex justify-between mt-2">
              <p className="text-[#84818A] text-sm">Claim pattern</p>
              <p className="text-[#2E2C34] text-sm font-[700]">Transfer</p>
            </div>
          </div>
          <div className="border border-gray-300 my-4"></div>
          <div className=" w-full">
            <div className="flex justify-between mt-2">
              <p className="text-[#84818A] text-sm">To be secured</p>
              <p className="text-[#2E2C34] text-sm font-[700]">0.0 ICP</p>
            </div>
            <div className="flex justify-between mt-2">
              <p className="text-[#84818A] text-sm">Included into the links</p>
              <p className="text-[#2E2C34] text-sm font-[700]">0.0 ICP</p>
            </div>
          </div>
          <div className="border border-gray-300 my-4"></div>
          <div className=" w-full">
            <div className="flex justify-between">
              <p className="text-[#84818A] text-sm">Total amount</p>
              <p className="text-[#2E2C34] text-sm font-[700]">0.0 ICP</p>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default DistributionPages;
