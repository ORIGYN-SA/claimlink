import React from "react";
import { motion } from "framer-motion";
import { TfiPlus } from "react-icons/tfi";
import { useNavigate } from "react-router-dom";
import { GoPlus } from "react-icons/go";
import { IoSettingsOutline } from "react-icons/io5";

const Minter = () => {
  const navigate = useNavigate();

  const createContract = () => {
    navigate("/minter/new-contract");
  };
  const openmynft = () => {
    navigate("/minter/new-contract/token-home");
  };
  return (
    <>
      <div className="p-4 min-h-full">
        {window.innerWidth < 640 ? (
          <div>
            {" "}
            <div className="flex justify-between items-center">
              <h2 className="text-2xl  font-semibold"> My NFT contracts</h2>
              <button
                onClick={createContract}
                className="flex items-center text-xl gap-2 bg-[#564BF1] px-2 py-1 text-white rounded-md"
              >
                <GoPlus className="text-2xl" /> New contract
              </button>
            </div>
            {[1, 2, 3, 4, 5, 6].map((index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
                className="bg-white  py-6 mt-6 rounded-xl flex flex-col shadow-md"
                onClick={openmynft}
              >
                <div className="px-6">
                  <div className="flex justify-between items-center ">
                    <div className="flex items-center gap-3">
                      <img
                        width="80px"
                        height="80px"
                        src="https://images.pexels.com/photos/3621234/pexels-photo-3621234.jpeg?auto=compress&cs=tinysrgb&w=600"
                        alt="Dispenser"
                        className="rounded-lg"
                      />
                      <div className="">
                        <h2 className="text-lg sm:text-xl font-semibold  ">
                          Test collection
                        </h2>
                        <p className="text-sm text-gray-500  ">
                          April 5, 13:34
                        </p>
                      </div>
                    </div>
                    <div>
                      <IoSettingsOutline className="w-6 h-6 text-[#84818A]" />
                    </div>
                  </div>
                  <div className="border bg-[#EBEAED] mt-6 w-full"></div>
                  <div className=" w-full">
                    <div className="flex w-full justify-start relative">
                      <div className="w-1/2 p-2 flex justify-start">
                        <div className="flex flex-col justify-start">
                          <p className="text-gray-500">Address</p>
                          <p className="text-[#564BF1] font-medium text-lg">
                            0xf8c...992h4{" "}
                          </p>
                        </div>
                      </div>
                      <div className="w-1/2 p-2 flex flex-col justify-start relative">
                        <div className="absolute left-0 top-0 bottom-0 w-px bg-[#EBEAED]"></div>
                        <div className="flex flex-col justify-start pl-4">
                          <p className="text-gray-500">All token copies</p>
                          <p className="text-black font-medium text-lg">10</p>
                        </div>
                      </div>
                    </div>
                    <div className="border bg-[#EBEAED]  w-full"></div>
                    <div className="flex flex-wrap  relative">
                      <div className="w-1/2 mt-2 flex justify-start">
                        <div className="flex flex-col justify-start">
                          <p className="text-gray-500">Token standart</p>
                          <p className="text-black font-medium text-lg">
                            ERC1155
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center">
              <h2 className="text-lg sm:text-xl font-semibold">
                My NFT contracts
              </h2>
              <select
                name="Filter"
                id="filter"
                className="border border-gray-400 px-2 py-1 rounded-md outline-none text-sm"
              >
                <option value="filter">Filter</option>
                <option value="new">New</option>
                <option value="old">Old</option>
              </select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-4 gap-5 mt-5">
              <motion.div
                initial={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.9 }}
                className="bg-[#E9E8FC] px-4 py-4 rounded-xl flex flex-col items-center justify-center cursor-pointer"
                onClick={createContract}
              >
                <div className="bg-white p-3 m-4 rounded-md">
                  <TfiPlus className="text-[#564BF1] w-6 h-6 font-semibold" />
                </div>
                <h2 className="text-[#564BF1] text-lg sm:text-xl font-semibold mt-3 text-center">
                  Deploy new contract
                </h2>
                <p className="text-[#564BF1] text-sm text-center mt-2">
                  Mint a new token.
                </p>
              </motion.div>

              {[1, 2, 3].map((index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1 }}
                  className="bg-white px-4 py-4 rounded-xl flex flex-col cursor-pointer"
                  onClick={openmynft}
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
                      <p className="text-gray-500">Token standard</p>
                      <p className="text-gray-800 font-medium">ERC1155</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Minter;
