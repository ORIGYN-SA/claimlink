import { motion } from "framer-motion";
import React, { useMemo, useState } from "react";
import { TbInfoHexagon } from "react-icons/tb";
import { TfiPlus } from "react-icons/tfi";
import StyledDropzone from "../../common/StyledDropzone";
import Toggle from "react-toggle";
import { GoDownload, GoLink, GoPlus } from "react-icons/go";
import { BsCopy, BsQrCode } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import CommonModal from "../../common/CommonModel";
import { IoSettingsOutline } from "react-icons/io5";

const AddTokenHome = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const addToken = () => {
    navigate("/minter/new-contract/token-home/add-token");
  };
  const addcompaign = () => {
    navigate("/minter/new-contract/token-home/distribution-setup");
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };
  return (
    <>
      {window.innerWidth < 640 ? (
        <div className="p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="bg-white  py-6 mt-6 rounded-xl flex flex-col shadow-md"
          >
            <div className="px-6">
              <div className=" ">
                <h2 className="text-xl font-semibold  ">Test collection</h2>
              </div>
              <div className="border bg-[#EBEAED] mt-4 w-full"></div>
              <div className=" w-full">
                <div className="flex w-full justify-start relative ">
                  <div className="w-1/2 p-2 flex justify-start ">
                    <div className="flex flex-col justify-start">
                      <p className="text-gray-500">Collection symbol</p>
                      <p className="text-black font-medium text-lg">TST </p>
                    </div>
                  </div>
                  <div className="w-1/2  p-2 flex flex-col justify-start relative">
                    <div className="absolute left-0 top-0 bottom-0 w-px bg-[#EBEAED]"></div>
                    <div className="flex flex-col justify-start pl-4">
                      <p className="text-gray-500">Token address</p>
                      <div className="flex items-center gap-2 font-medium text-lg">
                        {" "}
                        <p className="text-[#564BF1] font-medium">
                          0xf8c...992h4
                        </p>
                        <BsCopy className="w-3 h-3 text-[#564BF1]" />
                      </div>
                      {/* <p className="text-black font-medium text-lg">10</p> */}
                    </div>
                  </div>
                </div>
                <div className="border bg-[#EBEAED]  w-full"></div>
                <div className="flex w-full justify-start relative">
                  <div className="w-1/2 p-2 flex justify-start">
                    <div className="flex flex-col justify-start">
                      <p className="text-gray-500">Token type</p>
                      <p className=" font-medium text-lg">ICRC-7 Token </p>
                    </div>
                  </div>
                  <div className="w-1/2 p-2 flex flex-col justify-start relative">
                    <div className="absolute left-0 top-0 bottom-0 w-px bg-[#EBEAED]"></div>
                    <div className="flex flex-col justify-start pl-4">
                      <p className="text-gray-500">Token standart</p>
                      <p className="text-black font-medium text-lg">ICRC-7</p>
                    </div>
                  </div>
                </div>
                <div className="border bg-[#EBEAED]  w-full"></div>
                <div className="flex w-full justify-start relative">
                  <div className="w-1/2 p-2 flex justify-start">
                    <div className="flex flex-col justify-start">
                      <p className="text-gray-500">Date of create</p>
                      <p className=" font-medium text-lg">
                        Dec. 11, 2024 13:54{" "}
                      </p>
                    </div>
                  </div>
                  <div className="w-1/2 p-2 flex flex-col justify-start relative">
                    <div className="absolute left-0 top-0 bottom-0 w-px bg-[#EBEAED]"></div>
                    <div className="flex flex-col justify-start pl-4">
                      <p className="text-gray-500">All token copies</p>
                      <p className="text-black font-medium text-lg">0</p>
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={addcompaign}
                className="px-6 flex gap-2 items-center justify-center w-full py-3 mt-2 bg-[#5542F6] text-white rounded-sm text-sm"
              >
                <GoLink />
                Create claim links
              </button>
            </div>
          </motion.div>

          <div className="flex justify-between items-center mt-10">
            <h2 className="text-2xl  font-semibold"> My NFTs</h2>
            <button
              onClick={addToken}
              className="flex items-center text-xl gap-2 bg-[#564BF1] px-2 py-1 text-white rounded-md"
            >
              <GoPlus className="text-2xl" /> Add token
            </button>
          </div>
          <div className="bg-[#EBEAED] py-10 text-center mt-10 rounded-sm">
            <h4 className="text-[#84818A] text-lg font-medium">
              You have no tokens yet
            </h4>
            <p className="text-[#84818A] text-sm mt-1">
              Press Add token to create one
            </p>
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ scale: 1, opacity: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{}}
          className="flex"
        >
          <div className="p-6 w-2/3">
            <div>
              <h2 className="text-xl font-semibold">My NFTs </h2>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <motion.div
                initial={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.9 }}
                className="bg-[#E9E8FC] px-4 py-8 mt-8 rounded-xl flex flex-col items-center justify-center cursor-pointer"
                onClick={addToken}
              >
                <div className="bg-white p-3 m-4 rounded-md">
                  <TfiPlus className="text-[#564BF1] w-6 h-6 font-semibold" />
                </div>
                <h2 className="text-[#564BF1] text-lg sm:text-xl font-semibold mt-3">
                  Add token
                </h2>
                <p className="text-[#564BF1] text-sm text-center mt-2">
                  Click here to add a new tocken to this collection
                </p>
              </motion.div>

              {[1, 2, 3].map((index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1 }}
                  className="bg-white px-4 py-4 mt-8 rounded-xl   cursor-pointer"
                >
                  <img
                    width="100px"
                    height="80px"
                    src="https://images.pexels.com/photos/3621234/pexels-photo-3621234.jpeg?auto=compress&cs=tinysrgb&w=600"
                    alt="Dispenser"
                  />
                  <h2 className="text-lg sm:text-xl font-semibold mt-5 ">
                    Test collection
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">April 5, 13:34</p>
                  <div className="border border-gray-300 my-4 w-full"></div>
                  <div className="mt-2 w-full">
                    <div className="flex justify-between">
                      <p className="text-gray-500">Address</p>
                      <p className="text-[#564BF1]">0xf8c...992h4</p>
                    </div>
                    <div className="flex justify-between mt-2">
                      <p className="text-gray-500">All token copies</p>
                      <p className="font-medium">10</p>
                    </div>
                    <div className="flex justify-between mt-2">
                      <p className="text-gray-500 line-clamp-1		">
                        Token standard{" "}
                      </p>
                      <p className="text-gray-800 font-medium"> ERC1155</p>
                    </div>
                  </div>
                  <div className="border border-gray-300 my-6"></div>
                  <button
                    onClick={toggleModal}
                    className="px-2 flex gap-2 items-center justify-center w-full py-3 mt-6 bg-[#5442f621] text-[#564BF1] rounded-sm text-sm"
                  >
                    <GoLink />
                    Create claim links
                  </button>
                  {isModalOpen && (
                    <>
                      <div
                        className="fixed inset-0 bg-[#7979792e]   z-40"
                        onClick={toggleModal}
                      ></div>
                      <div className="fixed inset-0 flex  items-center justify-center z-50">
                        <CommonModal
                          toggleModal={toggleModal}
                          title="Transfer NFT"
                        />
                      </div>
                    </>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
          <div className="w-1/3 bg-white p-6">
            <h2 className="font-semibold text-xl">Test collection</h2>
            <div className="mt-2 w-full">
              <div className="flex justify-between">
                <p className="text-gray-500">Collection symbol</p>
                <p className="text-gray-800 font-medium">TST</p>
              </div>
              <div className="flex justify-between mt-2">
                <p className="text-gray-500">Token address</p>
                <div className="flex items-center gap-2">
                  {" "}
                  <p className="text-[#564BF1] font-medium">0xf8c...992h4</p>
                  <BsCopy className="w-3 h-3 text-[#564BF1]" />
                </div>{" "}
              </div>
              <div className="flex justify-between mt-2">
                <p className="text-gray-500">Token type</p>
                <p className="text-gray-800 font-medium">ICRC-7 Token</p>
              </div>
              <div className="flex justify-between mt-2">
                <p className="text-gray-500">Token standart</p>
                <p className="text-gray-800 font-medium">ICRC-7</p>
              </div>
            </div>
            <div className="border border-gray-200 my-6"></div>
            <div className="mt-2 w-full">
              <div className="flex justify-between mt-2">
                <p className="text-gray-500">Date of create</p>
                <p className="text-gray-800 font-medium">
                  April 11, 2024 13:54
                </p>
              </div>
              <div className="flex justify-between mt-2">
                <p className="text-gray-500">All token copies</p>
                <p className="text-gray-800 font-medium">0</p>
              </div>
            </div>
            <div className="border border-gray-200 my-6"></div>

            <button
              onClick={addcompaign}
              className="px-6 flex gap-2 items-center justify-center w-full py-3 mt-6 bg-[#5542F6] text-white rounded-md text-sm"
            >
              <GoLink />
              Create claim links
            </button>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default AddTokenHome;
