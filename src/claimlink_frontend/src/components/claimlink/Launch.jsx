import React, { useState } from "react";
import { Checkbox, Switch } from "@headlessui/react";
import Toggle from "react-toggle";
import Summary from "./Summary";

const Launch = () => {
  const [expirationDate, setExpirationDate] = useState("");
  const [includeICP, setIncludeICP] = useState(false);
  const [icpAmount, setIcpAmount] = useState("");
  const [enabled, setEnabled] = useState(false);
  const [date, setDate] = useState("");
  const [hour, setHour] = useState("12");
  const [minute, setMinute] = useState("50");

  return (
    <div className="flex justify-between">
      <div className="p-6   w-[70%]   space-y-4">
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
        <div className="bg-gray-400 w-[75%] my-8 border border-gray-300/2"></div>

        <div>
          <div className="flex items-center justify-between w-[75%]">
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
          <div className=" mt-6  space-y-4 w-[75%]">
            <h1 className="text-lg font-semibold"> Expiration Date</h1>
            <div className="flex space-x-4">
              <div className="flex-1 relative">
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="border   rounded-md p-2 w-full"
                  placeholder="12-24-2024"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 00-1-1H6zm1 3V3h6v2H7z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              <select
                value={hour}
                onChange={(e) => setHour(e.target.value)}
                className="border   rounded-md p-2"
              >
                {Array.from({ length: 24 }, (_, i) => (
                  <option key={i} value={String(i).padStart(2, "0")}>
                    {String(i).padStart(2, "0")}
                  </option>
                ))}
              </select>
              <select
                value={minute}
                onChange={(e) => setMinute(e.target.value)}
                className="border   rounded-md p-2"
              >
                {Array.from({ length: 60 }, (_, i) => (
                  <option key={i} value={String(i).padStart(2, "0")}>
                    {String(i).padStart(2, "0")}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="bg-gray-400 w-[75%] my-8 border border-gray-300/2"></div>
        </div>

        <div>
          <div className="flex items-center justify-between w-[75%]">
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
              Include native tokens to each link as an extra bonus for receiver
            </span>

            {includeICP && (
              <div className="mt-2">
                <input
                  type="text"
                  value={icpAmount}
                  onChange={(e) => setIcpAmount(e.target.value)}
                  className="border border-gray-300 rounded-md p-2 w-full"
                  placeholder="ICP to include"
                />
              </div>
            )}
          </div>
        </div>

        <div className="mt-10 flex   space-x-3  ">
          <button className="px-4 py-3  w-[20%] border-[#5542F6]  border text-[#5542F6]   text-sm font-quicksand  rounded transition  duration-200   ">
            Back
          </button>

          <button className="px-4 py-3  w-[20%] bg-[#5542F6]  text-sm font-quicksand  rounded transition  duration-200 hover:bg-blue-600 text-white">
            Launch campaign
          </button>
        </div>
      </div>
      <Summary />
    </div>
  );
};

export default Launch;
