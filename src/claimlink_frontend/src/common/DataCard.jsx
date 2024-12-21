import React from "react";
import toast from "react-hot-toast";
import { BsCopy } from "react-icons/bs";
import { BsDownload } from "react-icons/bs";
import { trackEvent } from "./trackEvent";

const DataCard = ({ campaignDetails, depositIndex, keys }) => {
  const PROD = true;

  // Define the base URL depending on the environment
  const url = PROD
    ? `https://${process.env.CANISTER_ID_CLAIMLINK_FRONTEND}.icp0.io`
    : "http://localhost:3000";

  // Construct the full URL based on campaign details
  const url2 = `${url}/linkclaiming/${campaignDetails?.collection?.toText()}/${parseInt(
    depositIndex
  )}`;

  // Fallback function to handle copying if Clipboard API is blocked
  const fallbackCopy = (text) => {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand("copy");
      toast.success("Link copied to clipboard!"); // Alert to confirm the action
    } catch (err) {
      console.error("Fallback: Oops, unable to copy", err);
      toast.error("Failed to copy link.");
    }
    document.body.removeChild(textarea);
  };

  // Function to handle copying to the clipboard
  const handleCopy = (text) => {
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          toast.success("Link copied to clipboard!");
          trackEvent("claimlink_copied ", {
            event_category: "engagement",
            event_label: text,
            method: "fallback",
          }); // Optional: Alert to confirm the action
        })
        .catch((err) => {
          console.error(
            "Failed to copy using Clipboard API, using fallback",
            err
          );
          fallbackCopy(text); // Use fallback if Clipboard API fails
        });
    } else {
      fallbackCopy(text); // Use fallback if Clipboard API is not available
    }
  };

  function convertNanosecondsToDate(nanosecondTimestamp) {
    // Convert nanoseconds to milliseconds
    const millisecondTimestamp = Number(nanosecondTimestamp / 1000000n);

    // Create a Date object
    const date = new Date(millisecondTimestamp);

    // Define options for formatting the date
    const options = {
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };

    // Format the date to a human-readable string
    return date.toLocaleString("en-US", options);
  }

  return (
    <>
      <div className="max-w-sm sm:hidden rounded overflow-hidden shadow-lg p-4">
        <div className="flex items-center space-x-4 border-b border-gray-300">
          {/* <img
            className="w-12 h-12 rounded"
            src="https://via.placeholder.com/50"
            alt="Avatar"
          /> */}
          <div className="">
            <span className="text-gray-800 flex items-center  font-semibold  text-lg gap-2">
              {campaignDetails?.createdBy?.toText()}
              <BsCopy
                className="text-[#564BF1]"
                onClick={() => {
                  handleCopy(campaignDetails?.createdBy?.toText());
                }}
              />
            </span>
            <div className="text-gray-500 text-xs">
              {convertNanosecondsToDate(campaignDetails?.createdAt)}
            </div>
          </div>
          <div className="border-l border-gray-300 p-2">
            <div className="text-gray-500">Links</div>
            <div className="font-bold text-sm">1</div>
          </div>
        </div>
        <div className="flex justify-center mt-2">
          <p
            className="text-[#564BF1] underline gap-2 truncate flex items-center cursor-pointer"
            onClick={() => {
              handleCopy(url2);
            }}
          >
            <BsCopy className="text-[#564BF1]" />
            Copy Link
          </p>
        </div>
      </div>
      <div className="hidden md:block">
        <div className="flex text-sm items-center justify-between p-4 w-full bg-white rounded space-x-4">
          <div className="flex items-center space-x-2">
            <span className="font-bold">{keys + 1}</span>
            {/* <img
              src="https://via.placeholder.com/50"
              alt="Item"
              className="w-10 h-10 rounded-md"
            /> */}
            <span className="text-gray-800 flex items-center w-[88px]  pl-12  truncate font-semibold gap-2">
              {campaignDetails?.createdBy?.toText()}
            </span>
            <BsCopy
              className="text-[#564BF1]"
              onClick={() => {
                handleCopy(campaignDetails?.createdBy?.toText());
              }}
            />
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-gray-800 font-semibold">
              {convertNanosecondsToDate(campaignDetails?.createdAt)}
            </span>
            {/* <span className="text-gray-500">20:19</span> */}
          </div>
          <div className="text-gray-800 font-semibold ml-2">1</div>
          {/* Copy Link Button */}
          <p
            className="text-[#564BF1] hover:underline gap-2 flex items-center cursor-pointer"
            onClick={() => {
              handleCopy(url2);
            }} // Call handleCopy on click
          >
            <BsCopy className="text-[#564BF1]" />
            Copy Link
          </p>
        </div>
      </div>
    </>
  );
};

export default DataCard;
