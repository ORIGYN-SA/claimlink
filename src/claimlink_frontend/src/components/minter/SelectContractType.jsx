import React from "react";
import { CiImageOn, CiWallet } from "react-icons/ci";
import { IoImagesOutline } from "react-icons/io5";
import { TbInfoHexagon } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import gallery from "../../assets/svg/gallery.svg";
const SelectContractType = () => {
  const navigate = useNavigate();
  const opensetup = () => {
    navigate("/minter/new-contract/collection-setup");
  };

  return (
    <div className="p-6 md:w-3/5 w-full">
      <div>
        <h2 className="text-xl font-semibold">Select contract type</h2>
      </div>
      <div>
        <form action="" className="">
          <div
            className="mt-6 flex flex-col bg-white md:py-7 py-4 rounded-xl  px-4 cursor-pointer border border-[#EBEAED]"
            onClick={opensetup}
          >
            <svg
              className="text-[#564BF1]  md:mb-6 mb-3"
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="6.66797"
                y="6.66675"
                width="24"
                height="24"
                rx="4.2"
                stroke="#564BF1"
                stroke-width="1.5"
              />
              <path
                d="M2.66797 7.46675C2.66797 4.81578 4.817 2.66675 7.46797 2.66675H21.868C24.5189 2.66675 26.668 4.81578 26.668 7.46675V21.8667C26.668 24.5177 24.5189 26.6667 21.868 26.6667H7.46797C4.817 26.6667 2.66797 24.5177 2.66797 21.8667V7.46675Z"
                fill="white"
              />
              <path
                d="M13.468 10.4667C13.468 12.1236 12.1248 13.4667 10.468 13.4667C8.81111 13.4667 7.46797 12.1236 7.46797 10.4667C7.46797 8.80989 8.81111 7.46675 10.468 7.46675C12.1248 7.46675 13.468 8.80989 13.468 10.4667Z"
                fill="white"
              />
              <path
                d="M26.668 17.0667L23.1412 14.5274C21.3085 13.208 18.804 13.3443 17.1255 14.855L12.2105 19.2785C10.5319 20.7892 8.0274 20.9255 6.19478 19.6061L2.66797 17.0667M7.46797 26.6667H21.868C24.5189 26.6667 26.668 24.5177 26.668 21.8667V7.46675C26.668 4.81578 24.5189 2.66675 21.868 2.66675H7.46797C4.817 2.66675 2.66797 4.81578 2.66797 7.46675V21.8667C2.66797 24.5177 4.817 26.6667 7.46797 26.6667ZM13.468 10.4667C13.468 12.1236 12.1248 13.4667 10.468 13.4667C8.81111 13.4667 7.46797 12.1236 7.46797 10.4667C7.46797 8.80989 8.81111 7.46675 10.468 7.46675C12.1248 7.46675 13.468 8.80989 13.468 10.4667Z"
                stroke="#564BF1"
                stroke-width="1.5"
                stroke-linecap="round"
              />
            </svg>

            <h4 className="text-lg font-medium">ERC-1155</h4>
            <p className="text-sm text-gray-500">
              Multiple copies of token with a common image. The most versatile
              selection for most marketing goals.
            </p>
          </div>
          <div className="flex md:flex-row flex-col w-full md:gap-4">
            <div className="mt-6 w-full md:w-1/2 flex flex-col bg-white md:py-7 py-4 rounded-xl  border border-[#EBEAED] px-4 cursor-pointer">
              <CiImageOn className="text-[#564BF1] w-6 h-6 mb-6" />
              <h4 className="text-lg font-medium">ICRC-7</h4>
              <p className="text-sm text-gray-500">
                Unique tokens with individual images. Currently available
                manually by request
              </p>
            </div>
            <div className="mt-6 w-full md:w-1/2  flex flex-col bg-white md:py-7 py-4 rounded-xl  px-4 cursor-pointer border border-[#EBEAED]">
              <CiWallet className="text-[#564BF1] w-6 h-6 mb-6" />
              <h4 className="text-lg font-medium">IRC-20</h4>
              <p className="text-sm text-gray-500">
                Assets with no media, consider USDT as an example. Currently
                available manually by request
              </p>
            </div>
          </div>
        </form>
        <button className="px-6 mt-16 w-full md:w-auto py-2 md:mt-6 bg-[#5542F6] text-white rounded-md text-sm">
          Next
        </button>
      </div>
    </div>
  );
};

export default SelectContractType;
