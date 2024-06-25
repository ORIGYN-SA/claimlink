import React from "react";

const QrSetup = () => {
  return (
    <div className="p-6">
      <div className="h-screen    p-6 ">
        <p className="text-2xl text-gray-900 font-semibold">New QR set</p>

        <div className="space-y-3 mt-6">
          <p className="text-gray-900 font-semibold">Name of the set</p>
          <input
            type="text"
            className="w-[50%] h-10 rounded border-2 px-3 border-gray-100"
            placeholder="Text "
          />
        </div>
        <div className="space-y-3 mt-6">
          <p className="text-gray-900 font-semibold">Quality</p>
          <input
            type="text"
            className="w-[50%] h-10 rounded border-2 px-3 border-gray-100"
            placeholder="Text "
          />
        </div>
        <button className="px-4 py-3  mt-8 w-[12.5%] bg-[#5542F6]  text-xs font-quicksand  rounded transition  duration-200 hover:bg-blue-600 text-white">
          Next
        </button>
      </div>
    </div>
  );
};

export default QrSetup;
