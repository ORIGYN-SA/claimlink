import React from "react";

import { motion } from "framer-motion";
import { useMemo, useState, useEffect } from "react";
import { TbInfoHexagon } from "react-icons/tb";
import { TfiPlus } from "react-icons/tfi";

import Toggle from "react-toggle";
import { GoDownload, GoLink, GoPlus } from "react-icons/go";
import { BsCopy, BsQrCode } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

import { RxCross2 } from "react-icons/rx";
import toast from "react-hot-toast";

const NftMobileCards = ({ nft, filter }) => {
  const [descriptionModel, setDescriptionModel] = useState(false);
  const handleDes = () => {
    setDescriptionModel(!descriptionModel);
  };
  const navigate = useNavigate();

  const limitCharacters = (text, charLimit) => {
    if (!text || text.length === 0) {
      return ""; // or return a fallback string like "N/A" if needed
    }
    if (text.length > charLimit) {
      return text.slice(0, charLimit) + "...";
    }
    return text;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1 }}
      className="bg-white px-4 py-4 mt-8 rounded-xl   cursor-pointer"
    >
      <div className="flex">
        {filter == "non-fungible" ? (
          <img
            width="80px"
            height="80px"
            src={nft[2]?.nonfungible?.thumbnail}
            alt="Dispenser"
            className="w-16  h-16 rounded"
          />
        ) : (
          <img
            width="80px"
            height="80px"
            src={nft[1]?.nonfungible?.thumbnail}
            alt="Dispenser"
            className="w-16  h-16 rounded"
          />
        )}
        <div className="ml-2">
          {filter == "non-fungible" ? (
            <h2 className="text-xl black  font-bold  mt-5 ">
              {limitCharacters(nft[2]?.nonfungible?.name, 15)}
            </h2>
          ) : (
            <h2 className="text-xl black  font-bold  mt-5 ">
              {limitCharacters(nft[1]?.nonfungible?.name, 15)}
            </h2>
          )}

          <p className="text-xs gray ">April 5, 13:34</p>
        </div>
      </div>
      <div className="border border-gray-200  mt-4 w-full"></div>
      <div className=" w-full">
        <div className="flex">
          {filter == "non-fungible" && (
            <div className="w-1/2 p-2 flex justify-start">
              <div className="flex flex-col justify-start">
                <p className="text-[#84818A] md:text-sm text-xs">Address</p>
                <p className="text-[#564BF1] font-semibold text-sm truncate w-32">
                  {typeof nft[1] === "object" ? "" : nft[1]}{" "}
                </p>
              </div>
            </div>
          )}
          <div className="w-1/2 p-2 flex flex-col justify-start relative">
            <div className="absolute left-0 top-0 bottom-0 w-px bg-[#bbb9bd]"></div>
            <div className="flex flex-col justify-start pl-4">
              <p className="text-[#84818A] md:text-sm text-xs">
                All token copies
              </p>
              <p className="text-[#2E2C34] font-semibold text-sm">1</p>
            </div>
          </div>
        </div>
        <div className="border border-gray-200  w-full"></div>
        <div className="flex">
          <div className="w-1/2 p-2 flex justify-start">
            <div className="flex flex-col justify-start">
              <p className="text-[#84818A] md:text-sm text-xs">ID</p>
              <p className="text-[#564BF1] font-semibold text-sm truncate w-32">
                {nft[0]}
              </p>
            </div>
          </div>
          {filter == "non-fungible" && (
            <div className="w-1/2 p-2 flex flex-col justify-start relative">
              <div className="absolute left-0 top-0 bottom-0 w-px bg-[#bbb9bd]"></div>
              <div className="flex flex-col justify-start pl-4">
                <p className="text-[#84818A] md:text-sm text-xs">Description</p>
                <p
                  className="text-xs font-semibold text-[#564BF1] underline"
                  onClick={handleDes}
                >
                  view
                </p>
              </div>
            </div>
          )}
        </div>

        {filter == "non-fungible" && (
          <div className="flex justify-between mt-2">
            {descriptionModel && (
              <>
                <div
                  className="fixed inset-0 bg-[#7979792e]   z-40"
                  onClick={handleDes}
                ></div>
                <div className="fixed inset-0  items-center justify-center bg z-50">
                  <div className="h-screen w-screen top-0 bottom-0 left-0 right-0 flex items-center justify-center bg-transparent">
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{
                        scale: 1,
                        opacity: 1,
                        transition: {
                          ease: "easeInOut",
                          duration: 0.4,
                        },
                      }}
                      className="filter-card px-2 py-2 bg-white rounded-xl w-[400px] h-[260px]"
                    >
                      <div className="flex justify-between items-center">
                        <h1 className="text-2xl px-6 font-medium">
                          Description
                        </h1>
                        <button
                          className="p-2 rounded-md bg-[#564BF1] hover:bg-[#4039c8]"
                          onClick={handleDes}
                        >
                          <RxCross2 className="text-white w-5 h-5" />
                        </button>
                      </div>
                      {/* Updated description container with scroll */}
                      <div className="px-6 text-sm mt-2 text-gray-500 h-[150px] overflow-scroll scrollbar-hide">
                        {nft[2]?.nonfungible?.description}
                      </div>
                      <div className="flex justify-end mt-4"></div>
                    </motion.div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
      <div className="border border-gray-200 my-4"></div>
      <button
        onClick={() => {
          navigate("/campaign-setup");
        }}
        className="px-2 flex gap-2  items-center justify-center w-full py-3  bg-[#5442f621] text-[#564BF1] rounded-sm text-sm"
      >
        <GoLink />
        Create claim links
      </button>
    </motion.div>
  );
};

export default NftMobileCards;
