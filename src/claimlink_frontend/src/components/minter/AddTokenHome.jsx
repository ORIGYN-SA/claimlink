import { motion } from "framer-motion";
import React, { useMemo } from "react";
import { TbInfoHexagon } from "react-icons/tb";
import { TfiPlus } from "react-icons/tfi";
import StyledDropzone from "../../common/StyledDropzone";
import Toggle from "react-toggle";
import { GoDownload, GoLink } from "react-icons/go";
import { BsCopy, BsQrCode } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

const AddTokenHome = () => {
  const navigate = useNavigate();

  const addToken = () => {
    navigate("/minter/new-contract/token-home/add-token");
  };
  return (
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
        <div className="grid grid-cols-3">
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
            <p className="text-gray-800 font-medium">April 11, 2024 13:54</p>
          </div>
          <div className="flex justify-between mt-2">
            <p className="text-gray-500">All token copies</p>
            <p className="text-gray-800 font-medium">0</p>
          </div>
        </div>
        <div className="border border-gray-200 my-6"></div>

        <button className="px-6 flex gap-2 items-center justify-center w-full py-3 mt-6 bg-[#5542F6] text-white rounded-md text-sm">
          <GoLink />
          Create claim links
        </button>
      </div>
    </motion.div>
  );
};

export default AddTokenHome;
