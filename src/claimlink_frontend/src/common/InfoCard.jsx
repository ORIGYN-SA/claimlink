import React from "react";
import { IoSettingsOutline } from "react-icons/io5";

const InfoCard = () => {
  return (
    <div>
      {" "}
      <div className="max-w-sm sm:hidden mx-auto bg-white rounded-lg   p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="px-4">
            <h2 className="text-lg font-semibold">Title</h2>
            <p className="text-sm text-gray-500">December 5, 13:54</p>
          </div>
          <div>
            <button className="p-2 rounded-full hover:bg-gray-200">
              <IoSettingsOutline className="text-gray-400" size={24} />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-0">
          <div className="flex flex-col border p-4 border-l-0  border-gray-300">
            <span className="text-sm text-gray-500">Status</span>
            <span className="font-medium text-red-500">Not uploaded</span>
          </div>
          <div className="flex flex-col border p-4  border-r-0 border-gray-300">
            <span className="text-sm text-gray-500">Additional</span>
            <span className="font-medium">Not sent to printer</span>
          </div>
          <div className="flex flex-col border p-4 border-l-0 border-gray-300">
            <span className="text-sm text-gray-500">Start date</span>
            <span className="font-medium">April 11, 2024</span>
          </div>
          <div className="flex flex-col border p-4 border-r-0 border-gray-300">
            <span className="text-sm text-gray-500">Quantity</span>
            <span className="font-medium">10</span>
          </div>
        </div>
        <div className="   p-4">
          <span className="text-sm text-gray-500">Linked campaign</span>
          <p className="font-medium">e-cards</p>
        </div>
      </div>
      {/* new card for desktop */}
      <div className="p-6 max-w-xs hidden sm:block mx-auto bg-white rounded-xl   space-y-4">
        <div className="">
          <h1 className="text-xl font-bold">Title</h1>
          <p className="text-gray-500">April 5, 13:54</p>
        </div>
        <div className="space-y-2 text-xs font-semibold">
          <div className="flex justify-between">
            <span className="text-gray-500 font-semibold ">Status</span>
            <span className="text-red-500 font-semibold">Not uploaded</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 font-semibold">Additional</span>
            <span className="text-gray-800 font-semibold">
              Not sent to printer
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 font-semibold">Start date</span>
            <span className="text-gray-800 font-semibold">
              April 11, 2024 <span className="text-gray-400">13:54</span>
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 font-semibold">Quantity</span>
            <span className="text-gray-800 font-semibold">10</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 font-semibold">Linked campaign</span>
            <span className="text-gray-800 font-semibold">e-cards</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoCard;
