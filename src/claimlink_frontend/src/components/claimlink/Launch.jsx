import React, { useState } from "react";
import { Checkbox, Switch } from "@headlessui/react";
import Toggle from "react-toggle";
import Summary from "./Summary";
import Stepper from "../../common/Stepper";
import { SlCalender } from "react-icons/sl";
import { TbInfoHexagon } from "react-icons/tb";

const Launch = () => {
  const [expirationDate, setExpirationDate] = useState("");
  const [includeICP, setIncludeICP] = useState(true);
  const [icpAmount, setIcpAmount] = useState("");
  const [enabled, setEnabled] = useState(false);
  const [date, setDate] = useState("");
  const [hour, setHour] = useState("12");
  const [minute, setMinute] = useState("50");

  return (
    <>
      <Stepper currentStep={4} />
      <div className="flex justify-between">
        <div className="p-6   sm:w-[70%]   space-y-6">
          <h1 className="text-3xl font-semibold">Wallet option</h1>
          <div>
            <p className="font-semibold text-sm text-gray-400 my-4">
              Select the wallet that will be highlighted as "recommended"
            </p>
            <div className="mt-2  flex flex-col space-y-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="wallet"
                  className="form-radio "
                  style={{ backgroundColor: "#5542F6" }}
                />
                <span className="ml-2">Internet Identity</span>
              </label>
              <label className="inline-flex items-center ">
                <input type="radio" name="wallet" className="form-radio" />
                <span className="ml-2">Plug Wallet</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="wallet"
                  className="form-radio"
                  defaultChecked
                />
                <span className="ml-2">Other</span>
              </label>
            </div>
          </div>

          <div className="flex  flex-col">
            <p className="font-semibold text-sm text-gray-400 my-4">
              Select the wallets user will see as other connection options
            </p>
            <div className="mt-2 flex space-y-4 flex-col">
              <label className="inline-flex items-center">
                <Checkbox
                  checked={enabled}
                  onChange={setEnabled}
                  className="group block size-4 rounded border bg-white data-[checked]:bg-[#5542F6] "
                >
                  {/* Checkmark icon */}
                  <svg
                    className="stroke-white opacity-0 group-data-[checked]:opacity-100"
                    viewBox="0 0 14 14"
                    fill="none"
                  >
                    <path
                      d="M3 8L6 11L11 3.5"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Checkbox>
                <span className="ml-2">Internet Identity</span>
              </label>
              <label className="inline-flex items-center  ">
                <Checkbox
                  checked={enabled}
                  onChange={setEnabled}
                  className="group block size-4 rounded border bg-white data-[checked]:bg-[#5542F6] "
                >
                  {/* Checkmark icon */}
                  <svg
                    className="stroke-white opacity-0 group-data-[checked]:opacity-100"
                    viewBox="0 0 14 14"
                    fill="none"
                  >
                    <path
                      d="M3 8L6 11L11 3.5"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Checkbox>
                <span className="ml-2">Plug Wallet</span>
              </label>
              <label className="inline-flex items-center  ">
                <Checkbox
                  checked={enabled}
                  onChange={setEnabled}
                  className="group block size-4 rounded border bg-white data-[checked]:bg-[#5542F6] "
                >
                  {/* Checkmark icon */}
                  <svg
                    className="stroke-white opacity-0 group-data-[checked]:opacity-100"
                    viewBox="0 0 14 14"
                    fill="none"
                  >
                    <path
                      d="M3 8L6 11L11 3.5"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Checkbox>
                <span className="ml-2">Other</span>
              </label>
            </div>
          </div>
          <div className="bg-gray-400 sm:w-[75%] my-8 border border-gray-300/2"></div>

          <div>
            <div className="flex items-center justify-between sm:w-[75%]">
              <p className="font-semibold text-lg">Link expiration</p>
              <Switch
                checked={enabled}
                onChange={setEnabled}
                className="group inline-flex h-6 w-12 items-center rounded-full bg-gray-200 transition  "
              >
                <span className="size-4 translate-x-1 rounded-full  bg-[#5542F6] transition group-data-[checked]:translate-x-7" />
              </Switch>
            </div>
            <p className="font-semibold text-sm text-gray-400 my-4">
              You can setup the the link expiration, so that users will not able
              to claim after certain day and time
            </p>
            <div className=" mt-6  space-y-4 sm:w-[75%]">
              <h1 className="text-lg font-semibold"> Expiration Date</h1>
              <div className="flex md:flex-row flex-col w-full justify-between gap-4">
                <input
                  type="date"
                  name="startDate"
                  id="startDate"
                  className="bg-white px-2 py-2 outline-none border border-gray-200  sm:w-[73%] w-full  rounded-md "
                />
                <div className="flex md:justify-normal justify-between gap-4">
                  <select
                    name="startHour"
                    id="startHour"
                    className="bg-white w-full px-2 py-2 outline-none border border-gray-200 rounded-md"
                  >
                    <option value="">12</option>
                    <option value="">13</option>
                    <option value="">14</option>
                  </select>
                  <select
                    name="startMinute"
                    id="startMinute"
                    className="bg-white w-full px-2 py-2 outline-none border border-gray-200 rounded-md"
                  >
                    <option value="">11</option>
                    <option value="">12</option>
                    <option value="">13</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-2 ">
              <TbInfoHexagon className="text-[#564BF1] " size={20} />
              <p className="text-sm text-gray-500">Enter expiration date</p>
            </div>
            <div className="bg-gray-400 sm:w-[75%] my-8 border border-gray-300/2"></div>
          </div>

          <div>
            <div className="flex items-center justify-between sm:w-[75%]">
              <p className="font-semibold text-lg">Include extra ICP</p>
              <Switch
                checked={enabled}
                onChange={setEnabled}
                className="group inline-flex h-6 w-12 items-center rounded-full bg-gray-200 transition  "
              >
                <span className="size-4 translate-x-1 rounded-full  bg-[#5542F6] transition group-data-[checked]:translate-x-7" />
              </Switch>
            </div>
            <div className="mt-2">
              <span className="font-semibold text-gray-400 text-sm">
                Include native tokens to each link as an extra bonus for
                receiver
              </span>

              {includeICP && (
                <div className="">
                  <p className="text-gray-900 text-lg font-semibold mt-4">
                    ICP to include
                  </p>
                  <input
                    type="text"
                    className="sm:w-[75%] mt-4 w-full h-12 rounded border-2 px-3 outline-none border-gray-100"
                    placeholder="Text "
                  />
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 mt-3 ">
              <TbInfoHexagon className="text-[#564BF1]" size={20} />
              <p className="text-sm text-gray-500">
                This amount of native tokens will include to each link as bonus
                for receiver
              </p>
            </div>
          </div>

          <div className="mt-16 flex   space-x-3  ">
            <button className="px-4 py-3  sm:w-[20%] w-1/2 border-[#5542F6]  border text-[#5542F6]   text-sm  rounded transition  duration-200   ">
              Back
            </button>

            <button className="px-4 py-3  sm:w-[20%] w-1/2 bg-[#5542F6]  text-sm   rounded transition  duration-200 hover:bg-blue-600 text-white">
              Launch campaign
            </button>
          </div>
        </div>
        <Summary />
      </div>
    </>
  );
};

export default Launch;
