import React from "react";

const InfoCard = () => {
  return (
    <div className="p-6 max-w-xs mx-auto bg-white rounded-xl   space-y-4">
      <div className="">
        <h1 className="text-xl font-bold">Title</h1>
        <p className="text-gray-500">April 5, 13:54</p>
      </div>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">Status</span>
          <span className="text-red-500">Not uploaded</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Additional</span>
          <span className="text-gray-800">Not sent to printer</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Start date</span>
          <span className="text-gray-800">
            April 11, 2024 <span className="text-gray-400">13:54</span>
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Quantity</span>
          <span className="text-gray-800">10</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Linked campaign</span>
          <span className="text-gray-800">e-cards</span>
        </div>
      </div>
    </div>
  );
};

export default InfoCard;
