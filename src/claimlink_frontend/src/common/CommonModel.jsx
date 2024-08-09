import { motion } from "framer-motion";
import { useState } from "react";
import { RiErrorWarningFill } from "react-icons/ri";
import { RxCross2 } from "react-icons/rx";

const CommonModal = ({ toggleModal }) => {
  return (
      <div className="h-screen w-screen top-0 bottom-0 left-0 right-0 flex items-center justify-center bg-transparent ">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: 1,
            opacity: 1,
            transition: { ease: "easeInOut", duration: 0.4 },
          }}
          className="filter-card px-6 py-2 bg-white  rounded-xl w-[400px] h-[260px]"
        >
          <div className="flex flex-col mt-2">
            <div className="flex justify-between gap-4">
              <h1 className=" text-2xl font-medium">Create claim links</h1>
              <button
                className="bg-[#F5F4F7] p-2 rounded-md"
                onClick={toggleModal}
              >
                <RxCross2 className="text-gray-800 w-5 h-5" />
              </button>
            </div>
            <p className="text-gray-500 text-sm mt-2">
              How many claim links you want to create
            </p>

            <div className="mt-4">
              <form action="" className="flex flex-col ">
                <label htmlFor="" className="text-lg my-2">
                  Quantity
                </label>
                <input
                  type="text"
                  name=""
                  id=""
                  className="bg-[#F5F4F7] py-2 px-4 rounded-md border border-gray-200 outline-none"
                  placeholder="ect. 10"
                />
              </form>
            </div>
            <div className="flex justify-end items-end pt-4 gap-4">
              <button
                className={`button px-4 py-2 rounded-md text-white bg-[#564BF1]`}
              >
                Create
              </button>
            </div>
          </div>
        </motion.div>
      </div>
  );
};

export default CommonModal;
