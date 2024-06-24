import React from "react";
import { CiImageOn } from "react-icons/ci";
import { CiWallet } from "react-icons/ci";
import Summary from "./Summary";

const ClaimPattern = () => {
  return (
    <>
      <div className="flex justify-between">
        <div className="h-screen  w-[70%]  p-6 ">
          <p className="text-2xl text-gray-900 font-semibold">claim pattern</p>
          <p className="text-gray-500 mt-4 ">
            Choose the desired claim pattern and proceed with the appropriate
            transaction to enable it
          </p>
          <div className="w-[75%] space-y-3 mt-8">
            <div className="flex gap-4   ">
              <div className="w-[50%] rounded-md h-44 border-2 border-gray-100   p-4 bg-white ">
                <CiImageOn size={36} className="text-[#5542F6]" />
                <div>
                  <p className="font-semibold mt-10">Transfer</p>
                  <p className="text-sm text-gray-500">
                    Transfer should be preminted and will be transfered to user
                    at claim
                  </p>
                </div>
              </div>
              <div className="w-[50%] rounded-md h-44 border-2 border-gray-100  p-4 bg-white">
                <CiWallet size={36} className="text-[#5542F6]" />
                <div>
                  <p className="font-semibold mt-10">Mint</p>
                  <p className="text-sm text-gray-500">
                    Tokens will be minted to user address at claim
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 flex  space-x-3 ">
            <button className="px-4 py-3  w-[20%] border-[#5542F6]  border text-[#5542F6]   text-sm font-quicksand  rounded transition  duration-200   ">
              Back
            </button>
            <button className="px-4 py-3  w-[20%] bg-[#5542F6]  text-sm font-quicksand  rounded transition  duration-200 hover:bg-blue-600 text-white">
              Next
            </button>
          </div>
        </div>
        <Summary />
      </div>
    </>
  );
};

export default ClaimPattern;
