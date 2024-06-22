import React from "react";
import { TbInfoHexagon } from "react-icons/tb";

const DispenserSetup = () => {
  return (
    <div className="p-6 w-2/3">
      <div>
        <h2 className="text-xl font-semibold">Dispensers setup</h2>
      </div>
      <div>
        <form action="">
          <div className="mt-6 flex flex-col ">
            <label htmlFor="title" className="text-lg font-semibold py-3 ">
              Title
            </label>
            <input
              type="text"
              name=""
              id=""
              className="bg-white px-2 py-2 outline-none border border-gray-200 rounded-md"
              placeholder="Text"
            />
          </div>
          <div className="mt-2 flex flex-col ">
            <label htmlFor="title" className="text-lg font-semibold py-3 ">
              Start date
            </label>
            <div className="flex w-full justify-between gap-4">
              <input
                type="date"
                name=""
                id=""
                className="bg-white px-2 py-2 outline-none border border-gray-200 rounded-md w-full"
                placeholder="Text"
              />
              <select
                name=""
                id=""
                className="bg-white px-2 py-2 outline-none border border-gray-200 rounded-md "
              >
                <option value="">12</option>
                <option value="">13</option>
                <option value="">14</option>
              </select>
              <select
                name=""
                id=""
                className="bg-white px-2 py-2 outline-none border border-gray-200 rounded-md "
              >
                <option value="">11</option>
                <option value="">12</option>
                <option value="">13</option>
              </select>
            </div>
            <div className="flex items-center gap-4 mt-2 ">
              <TbInfoHexagon className="text-[#564BF1]" />
              <p className="text-sm text-gray-500">
                Enter start date in the DD-MM-YYY format, e. g. 11-04-2022
              </p>
            </div>
          </div>
          <div className="mt-2 flex flex-col ">
            <label htmlFor="title" className="text-lg font-semibold py-3 ">
              Duration
            </label>
            <input
              type="text"
              name=""
              id=""
              className="bg-white px-2 py-2 outline-none border border-gray-200 rounded-md"
              placeholder="Text"
            />
            <div className="flex items-center gap-4 mt-2 ">
              <TbInfoHexagon className="text-[#564BF1]" />
              <p className="text-sm text-gray-500">Enter duration in minutes</p>
            </div>
          </div>
        </form>
        <button className="px-6 py-2 mt-6 bg-[#5542F6] text-white rounded-md text-sm">
          Create
        </button>
      </div>
    </div>
  );
};

export default DispenserSetup;
