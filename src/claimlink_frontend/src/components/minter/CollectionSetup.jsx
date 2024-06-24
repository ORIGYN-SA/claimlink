import { motion } from "framer-motion";
import React, { useMemo } from "react";
import { TbInfoHexagon } from "react-icons/tb";
import { TfiPlus } from "react-icons/tfi";
import StyledDropzone from "../../common/StyledDropzone";
import Toggle from "react-toggle";
import { GoDownload } from "react-icons/go";
import { BsCopy, BsQrCode } from "react-icons/bs";

const CollectionSetup = () => {
  return (
    <motion.div
      initial={{ scale: 1, opacity: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{}}
      className="flex"
    >
      <div className="p-6 w-3/5">
        <div>
          <h2 className="text-xl font-semibold">Collection setup </h2>
        </div>
        <div>
          <form action="">
            <div className=" flex flex-col mt-8 ">
              <label htmlFor="title" className="text-md font-semibold py-3 ">
                Collection title{" "}
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
                Collection symbol{" "}
                <span className="text-gray-400 text-sm mb-3 font-normal">
                  (optional, max 5 symbols, etc. SYMBL, TKN)
                </span>
              </label>
              <input
                type="text"
                name=""
                id=""
                className="bg-white px-2 py-2 outline-none border border-gray-200 rounded-md"
                placeholder="text"
              />
              <div className="flex items-center gap-4 mt-2 ">
                <TbInfoHexagon className="text-[#564BF1]" />
                <p className="text-sm text-gray-500">
                  If you don’t know what a symbol is, keep it blank, and we will
                  use the auto-generated one based on title
                </p>
              </div>
            </div>
            <div className="mt-2 flex flex-col ">
              <label htmlFor="title" className="text-md font-semibold py-3 ">
                Collection thumbnail{" "}
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
          </form>
          <div className="flex gap-4">
            <button className="px-6 py-3 mt-6 text-[#5542F6] bg-white rounded-md text-sm">
              Back
            </button>
            <button className="px-6 py-3 mt-6 bg-[#5542F6] text-white rounded-md text-sm">
              Deploy collection{" "}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CollectionSetup;
