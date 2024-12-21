import React, { useState, useEffect } from "react";
import { useAuth } from "../connect/useClient";
import { motion } from "framer-motion";
import { IoSettingsOutline } from "react-icons/io5";

const CollectionDashBoardMobile = ({ data }) => {
  function convertNanosecondsToDate(timestamp) {
    let millisecondTimestamp;

    // Check if the input is in nanoseconds (e.g., more than 13 digits)
    if (timestamp > 9999999999999n) {
      // Convert nanoseconds to milliseconds
      millisecondTimestamp = Number(timestamp / 1000000n);
    } else {
      // Treat as milliseconds directly
      millisecondTimestamp = Number(timestamp);
    }

    // Create a Date object
    const date = new Date(millisecondTimestamp);

    // Define options for formatting the date
    const options = {
      month: "short",
      day: "numeric",
    };

    // Format the date to a human-readable string
    return date.toLocaleString("en-US", options);
  }

  const [copy, setCopy] = useState(0);
  const { backend } = useAuth();
  const [loader, setLoader] = useState(true);

  const getNonfungibleTokensNft = async () => {
    try {
      setLoader(true);

      const res = await backend.getNonFungibleTokensPaginate(data[1], 0, 1);

      const res1 = await backend.getStoredTokensPaginate(data[1], 0, 1);
      setCopy(parseInt(res.total_pages) + parseInt(res1.total_pages));
    } catch (error) {
      console.log("Error getting nfts length ", error);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    getNonfungibleTokensNft();
  }, [backend]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1 }}
      className="bg-[#F7F7F7] py-4 rounded-xl flex flex-col  w-[100vw] my-4"
    >
      <div className="px-4 w-80">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img
              width="80px"
              height="80px"
              src={data[4]}
              alt="Dispenser"
              className="rounded-lg"
            />
            <div>
              <h2 className="md:text-lg text-sm font-bold text-[#2E2C34]">
                {data[2]}
              </h2>
              <p className="text-[#84818A] md:text-sm text-xs">
                {/* {convertNanosecondsToDate(data?.createdAt)} */}
              </p>
            </div>
          </div>
          <div>
            <IoSettingsOutline className="w-6 h-6 text-[#84818A]" />
          </div>
        </div>
        <div className="border bg-[#EBEAED] mt-4 w-full"></div>
        <div className="w-full">
          <div className="flex w-full justify-start relative">
            <div className="w-1/2 p-2 flex justify-start">
              <div className="flex flex-col justify-start">
                <p className="text-[#84818A] md:text-sm text-xs">Address</p>
                <p className="text-[#564BF1] font-semibold text-sm line-clamp-1">
                  {data[1]?.toText()}
                </p>
              </div>
            </div>
            <div className="w-1/2 p-2 flex flex-col justify-start relative">
              <div className="absolute left-0 top-0 bottom-0 w-px bg-[#EBEAED]"></div>
              <div className="flex flex-col justify-start pl-4">
                <p className="text-[#84818A] md:text-sm text-xs">
                  All token copies
                </p>
                {loader ? (
                  <div className="w-16 h-5 bg-gray-300 animate-pulse rounded"></div>
                ) : (
                  <p className="text-[#2E2C34] font-semibold text-sm">{copy}</p>
                )}
              </div>
            </div>
          </div>
          <div className="border bg-[#EBEAED] w-full"></div>
          <div className="flex flex-wrap relative">
            <div className="w-1/2 mt-2 flex justify-start">
              <div className="flex flex-col justify-start">
                <p className="text-[#84818A] md:text-sm text-xs">
                  Token standard
                </p>
                <p className="text-[#2E2C34] font-semibold text-sm">EXT</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CollectionDashBoardMobile;
