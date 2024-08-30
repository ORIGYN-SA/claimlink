import React from "react";
import { BsCopy } from "react-icons/bs";
import { BsDownload } from "react-icons/bs";

const DataCard = ({ campaignDetails }) => {
  return (
    <>
      <div className="max-w-sm sm:hidden rounded overflow-hidden shadow-lg p-4">
        <div className="flex items-center       space-x-4 border-b border-gray-300">
          <img
            className="w-12 h-12 rounded"
            src="https://via.placeholder.com/50"
            alt="Avatar"
          />
          <div className="">
            <span className="text-gray-800  flex items-center font-bold text-lg gap-2">
              {campaignDetails?.createdBy?.toText()}
              <BsCopy className="text-[#564BF1]" />
            </span>
            <div className="text-gray-500 text-xs">April 11, 2024, 20:19</div>
          </div>
          <div className="border-l border-gray-300 p-2">
            <div className="text-gray-500">Links</div>
            <div className="font-bold text-sm">10</div>
          </div>
        </div>
        <div className="flex justify-center mt-2">
          <p className="text-[#564BF1] underline gap-2 flex items-center">
            <BsDownload />
            Download csv
          </p>
        </div>
      </div>
      <div className="hidden  md:block">
        <div className="flex text-sm  items-center justify-between p-4  w-full bg-white rounded space-x-4">
          <div className="flex items-center space-x-2">
            <span className="font-bold">1</span>
            <img
              src="https://via.placeholder.com/50"
              alt="Item"
              className="w-10 h-10 rounded-md"
            />
            <span className="text-gray-800 flex items-center font-semibold gap-2">
              66182...4be9d <BsCopy className="text-[#564BF1]" />
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-gray-800 font-semibold ">April 11, 2024</span>
            <span className="text-gray-500">20:19</span>
          </div>
          <div className="text-gray-800 font-semibold ">10</div>
          <p className="text-[#564BF1] hover:underline gap-2 flex items-center">
            <BsDownload />
            Download csv
          </p>
        </div>
      </div>
    </>
  );
};

export default DataCard;
