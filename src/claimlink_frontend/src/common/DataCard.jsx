import React from "react";
import toast from "react-hot-toast";
import { BsCopy } from "react-icons/bs";
import { BsDownload } from "react-icons/bs";

const DataCard = ({ campaignDetails, depositIndex, keys }) => {
  console.log(campaignDetails);
  console.log(depositIndex);

  // Define the base URL depending on the environment
  const url = process.env.PROD
    ? `https://${process.env.CANISTER_ID_CLAIMLINK_BACKEND}.icp0.io`
    : "http://localhost:3000";

  // Construct the full URL based on campaign details
  const url2 = `${url}/linkclaiming/${campaignDetails?.collection?.toText()}/${parseInt(
    depositIndex
  )}`;
  console.log(url2);

  // Function to handle copying to the clipboard
  const handleCopy = () => {
    navigator.clipboard
      .writeText(url2)
      .then(() => {
        toast.success("Link copied to clipboard!"); // Optional: Alert to confirm the action
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  return (
    <>
      <div className="max-w-sm sm:hidden rounded overflow-hidden shadow-lg p-4">
        <div className="flex items-center space-x-4 border-b border-gray-300">
          <img
            className="w-12 h-12 rounded"
            src="https://via.placeholder.com/50"
            alt="Avatar"
          />
          <div className="">
            <span className="text-gray-800 flex items-center font-bold text-lg gap-2">
              {campaignDetails?.createdBy?.toText()}
              <BsCopy className="text-[#564BF1]" />
            </span>
            <div className="text-gray-500 text-xs">April 11, 2024, 20:19</div>
          </div>
          <div className="border-l border-gray-300 p-2">
            <div className="text-gray-500">Links</div>
            <div className="font-bold text-sm">1</div>
          </div>
        </div>
        <div className="flex justify-center mt-2">
          <p className="text-[#564BF1] underline gap-2 flex items-center">
            <BsDownload />
            Download csv
          </p>
        </div>
      </div>
      <div className="hidden md:block">
        <div className="flex text-sm items-center justify-between p-4 w-full bg-white rounded space-x-4">
          <div className="flex items-center space-x-2">
            <span className="font-bold">{keys + 1}</span>
            <img
              src="https://via.placeholder.com/50"
              alt="Item"
              className="w-10 h-10 rounded-md"
            />
            <span className="text-gray-800 flex items-center w-24 pl-12 truncate font-semibold gap-2">
              {campaignDetails?.createdBy?.toText()}
            </span>
            <BsCopy className="text-[#564BF1]" />
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-gray-800 font-semibold">April 11, 2024</span>
            <span className="text-gray-500">20:19</span>
          </div>
          <div className="text-gray-800 font-semibold">1</div>
          {/* Copy Link Button */}
          <p
            className="text-[#564BF1] hover:underline gap-2 flex items-center cursor-pointer"
            onClick={handleCopy} // Call handleCopy on click
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
