import React, { useState, useEffect } from "react";
import { useAuth } from "../connect/useClient";

const CollectionDashBoardCard = ({ data }) => {
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
      console.log(res, "res1");
      const res1 = await backend.getStoredTokensPaginate(data[1], 0, 1);
      setCopy(parseInt(res.total_pages) + parseInt(res1.total_pages));
      console.log(res.length + res1.length, "hello sun ");

      console.log(res);
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
    <div className="grid grid-cols-5 gap-4 items-center rounded-md bg-white px-1 py-3">
      <div className="flex items-center gap-1">
        <img
          width="40px"
          height="60px"
          src={data[4]}
          alt="Dispenser"
          className="rounded-sm"
        />
        <div>
          <h2 className="text-xs text-[#2E2C34] font-semibold truncate w-12">
            {data[2]}
          </h2>
        </div>
      </div>
      <div>
        <p className="text-xs text-[#2E2C34] truncate w-[75px] font-semibold">
          {convertNanosecondsToDate(data[0])}
        </p>
      </div>
      <div>
        <p className="text-xs text-[#2E2C34] font-semibold">EXT</p>
      </div>
      <div>
        {loader ? (
          <div className="w-12 h-4 bg-gray-300 animate-pulse rounded"></div>
        ) : (
          <p className="text-xs text-[#2E2C34] font-semibold">{copy}</p>
        )}
      </div>
      <div className="flex gap-2 items-center">
        <p className="text-xs text-[#564BF1] truncate font-semibold">
          {data[1]?.toText()}
        </p>
      </div>
    </div>
  );
};

export default CollectionDashBoardCard;
