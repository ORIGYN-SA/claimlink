import { motion } from "framer-motion";
import React, { useMemo } from "react";
import { TbInfoHexagon } from "react-icons/tb";
import { TfiPlus } from "react-icons/tfi";
import StyledDropzone from "../../common/StyledDropzone";
import Toggle from "react-toggle";
import { GoDownload, GoLink } from "react-icons/go";
import { BsArrowRightSquare, BsCopy, BsQrCode } from "react-icons/bs";

const AddToken = () => {
  return (
    <motion.div
      initial={{ scale: 1, opacity: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{}}
      className="flex"
    >
      <div className="p-6 w-3/5">
        <div>
          <h2 className="text-xl font-semibold">Add token </h2>
        </div>
        <div>
          <form action="">
            <div className="mt-2 flex flex-col ">
              <label htmlFor="title" className="text-md font-semibold py-3 ">
                Upload a file
                <span className="text-gray-400 text-sm mb-3 font-normal ">
                  (PNG, JPG, GIF, MP4. Max 5MB)
                </span>
              </label>
              <div className="flex gap-4">
                <img
                  className="rounded-xl w-22 h-24"
                  src="https://images.pexels.com/photos/3621234/pexels-photo-3621234.jpeg?auto=compress&cs=tinysrgb&w=600"
                  alt=""
                />
                <StyledDropzone />
              </div>
            </div>
            <div className=" flex flex-col mt-8 ">
              <label htmlFor="title" className="text-md font-semibold py-3 ">
                Token name{" "}
                <span className="text-gray-400 text-sm mb-3 font-normal ">
                  (max 200 symbols)
                </span>
              </label>
              <input
                type="text"
                name=""
                id=""
                className="bg-white px-2 py-2 outline-none border border-gray-200 rounded-md"
                placeholder="text"
              />
            </div>
            <div className=" flex flex-col ">
              <label htmlFor="title" className="text-md font-semibold py-3 ">
                Description{" "}
                <span className="text-gray-400 text-sm mb-3 font-normal">
                  (optional, max XXX symbols)
                </span>
              </label>
              <input
                type="text"
                name=""
                id=""
                className="bg-white px-2 py-2 outline-none border border-gray-200 rounded-md"
                placeholder="text"
              />
            </div>

            <div className="flex w-full gap-4 mt-6">
              <div className="mt-6 w-1/2 flex flex-col bg-[#564BF1] text-white py-7 rounded-xl  px-4 cursor-pointer ">
                <GoLink className=" w-6 h-6 mb-6" />
                <h4 className="text-lg font-medium">Mint at Claim</h4>
                <p className="text-sm ">
                  Metadata will be uploaded now and tokens will be minted later
                  via Claim Links
                </p>
              </div>
              <div className="mt-6 w-1/2   flex flex-col bg-white py-7 rounded-xl  px-4 cursor-pointer">
                <BsArrowRightSquare className="text-[#564BF1] w-6 h-6 mb-6" />
                <h4 className="text-lg font-medium">Mint</h4>
                <p className="text-sm text-gray-500">
                  Tokens will be pre-minted to your account
                </p>
              </div>
            </div>
            <div className=" flex flex-col mt-4">
              <label htmlFor="title" className="text-md font-semibold py-3 ">
                Properties{" "}
                <span className="text-gray-400 text-sm mb-3 font-normal">
                  (optional)
                </span>
              </label>
              <div className="flex gap-4">
                <input
                  type="text"
                  name=""
                  id=""
                  className="bg-white px-2 py-2 outline-none border border-gray-200 rounded-md"
                  placeholder="e.g , Color"
                />
                <input
                  type="text"
                  name=""
                  id=""
                  className="bg-white px-2 py-2 outline-none border border-gray-200 rounded-md"
                  placeholder="e.g , Color"
                />
              </div>
            </div>
            <div className="flex mt-6 justify-center items-center py-1 bg-[#5442f63d] ">
              + Add more
            </div>
          </form>
          <div className="flex gap-4">
            <button className="px-6 py-3 mt-6 bg-[#5542F6] text-white rounded-md text-sm">
              Mint item{" "}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AddToken;
