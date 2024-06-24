import React from "react";
import { CiImageOn, CiWallet } from "react-icons/ci";
import { IoImagesOutline } from "react-icons/io5";
import { TbInfoHexagon } from "react-icons/tb";
import { useNavigate } from "react-router-dom";

const SelectContractType = () => {
  const navigate = useNavigate();
  const opensetup = () => {
    navigate("/minter/new-contract/collection-setup");
  };
  const openmynft = () => {
    navigate("/minter/new-contract/token-home");
  };

  return (
    <div className="p-6 w-3/5">
      <div>
        <h2 className="text-xl font-semibold">Select contract type</h2>
      </div>
      <div>
        <form action="">
          <div
            className="mt-6 flex flex-col bg-white py-7 rounded-xl  px-4 cursor-pointer"
            onClick={opensetup}
          >
            <IoImagesOutline className="text-[#564BF1] w-6 h-6 mb-6" />
            <h4 className="text-lg font-medium">ERC-1155</h4>
            <p className="text-sm text-gray-500">
              Multiple copies of token with a common image. The most versatile
              selection for most marketing goals.
            </p>
          </div>
          <div className="flex w-full gap-4">
            <div
              className="mt-6 w-1/2 flex flex-col bg-white py-7 rounded-xl  px-4 cursor-pointer"
              onClick={openmynft}
            >
              <CiImageOn className="text-[#564BF1] w-6 h-6 mb-6" />
              <h4 className="text-lg font-medium">ICRC-7</h4>
              <p className="text-sm text-gray-500">
                Unique tokens with individual images. Currently available
                manually by request
              </p>
            </div>
            <div className="mt-6 w-1/2   flex flex-col bg-white py-7 rounded-xl  px-4 cursor-pointer">
              <CiWallet className="text-[#564BF1] w-6 h-6 mb-6" />
              <h4 className="text-lg font-medium">IRC-20</h4>
              <p className="text-sm text-gray-500">
                Assets with no media, consider USDT as an example. Currently
                available manually by request
              </p>
            </div>
          </div>
        </form>
        <button className="px-6 py-2 mt-6 bg-[#5542F6] text-white rounded-md text-sm">
          Next
        </button>
      </div>
    </div>
  );
};

export default SelectContractType;
