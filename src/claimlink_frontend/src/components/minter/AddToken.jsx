import { motion } from "framer-motion";
import React, { useMemo, useState } from "react";
import { TbInfoHexagon } from "react-icons/tb";
import { TfiPlus } from "react-icons/tfi";
import StyledDropzone from "../../common/StyledDropzone";
import Toggle from "react-toggle";
import { GoDownload, GoLink } from "react-icons/go";
import { BsArrowRightSquare, BsCopy, BsQrCode } from "react-icons/bs";
import { MobileHeader } from "../../common/Header";

const AddToken = () => {
  const [showCopies, setShowCopies] = useState(false);
  return (
    <motion.div
      initial={{ scale: 1, opacity: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{}}
      className="flex "
    >
      <div className="p-6 w-full md:w-3/5">
        <div className="flex md:hidden justify-start">
          <MobileHeader htext={"New Contract"} />
        </div>
        <div>
          <h2 className="text-xl font-semibold md:mt-0 mt-8">Add token </h2>
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
              <div className="flex gap-4 flex-col md:flex-row">
                <img
                  className="rounded-xl md:w-22 md:h-24 w-28"
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
            <p className="text-md font-semibold mt-6 ">Mining</p>
            <div className="flex md:flex-row flex-col w-full md:gap-4 ">
              <div
                onClick={() => {
                  setShowCopies(false);
                }}
                className={`mt-6 md:w-1/2 w-full   flex flex-col md:py-7 py-4 rounded-xl  px-4 cursor-pointer ${
                  showCopies ? "bg-white " : " bg-[#564BF1] text-white"
                }`}
              >
                <GoLink
                  className={` md:w-6 md:h-6 w-5 h-5 mb-2  md:mb-6 ${
                    showCopies ? "text-[#564BF1] " : "text-white"
                  }`}
                />
                <h4 className="text-lg font-medium">Mint at Claim</h4>
                <p
                  className={`text-sm  ${
                    showCopies ? "  text-gray-500" : "text-white"
                  }`}
                >
                  Metadata will be uploaded now and tokens will be minted later
                  via Claim Links
                </p>
              </div>
              <div
                onClick={() => {
                  setShowCopies(true);
                }}
                className={`mt-6  md:w-1/2 w-full    flex flex-col  md:py-7 py-4 rounded-xl  px-4 cursor-pointer ${
                  showCopies ? "bg-[#564BF1] text-white" : "bg-white"
                }`}
              >
                <BsArrowRightSquare
                  className={` md:w-6 md:h-6 w-5 h-5 mb-2  md:mb-6 ${
                    showCopies ? " text-white" : "text-[#564BF1]"
                  }`}
                />
                <h4 className="text-lg font-medium">Mint</h4>
                <p
                  className={`text-sm  ${
                    showCopies ? " text-white" : "text-gray-500"
                  }`}
                >
                  Tokens will be pre-minted to your account
                </p>
              </div>
            </div>
            {showCopies ? (
              <div className=" flex flex-col mt-4 ">
                <label htmlFor="title" className="text-md font-semibold py-3 ">
                  Number of copies{" "}
                  <span className="text-gray-400 text-sm mb-3 font-normal">
                    (eg. 100)
                  </span>
                </label>
                <input
                  type="text"
                  name=""
                  id=""
                  className="bg-white px-2 py-2 outline-none border border-gray-200 rounded-md"
                  placeholder="Number"
                />
              </div>
            ) : null}
            <div className=" flex flex-col mt-4">
              <label htmlFor="title" className="text-md font-semibold py-3 ">
                Properties{" "}
                <span className="text-gray-400 text-sm mb-3 font-normal">
                  (optional)
                </span>
              </label>
              <div className="flex md:gap-4 gap-3 w-full">
                <input
                  type="text"
                  name=""
                  id=""
                  className="bg-white px-2 w-1/2 py-2 outline-none border border-gray-200 rounded-md"
                  placeholder="e.g , Color"
                />

                <input
                  type="text"
                  name=""
                  id=""
                  className="bg-white px-2 w-1/2 py-2 outline-none border border-gray-200 rounded-md"
                  placeholder="e.g , Color"
                />
              </div>
            </div>
            <div className="flex mt-6 justify-center items-center py-1 bg-[#5442f63d] ">
              + Add more
            </div>
          </form>
          <div className="flex gap-4">
            <button className="px-6 py-3  md:w-auto w-full md:mt-6 mt-14 bg-[#5542F6] text-white rounded-md text-sm">
              Mint item{" "}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AddToken;
