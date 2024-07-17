import React, { useState } from "react";
import { Checkbox, Switch } from "@headlessui/react";
import { motion } from "framer-motion";
import { TbInfoHexagon } from "react-icons/tb";
import Summary from "./Summary";
import MainButton, { BackButton } from "../../common/Buttons";

const Launch = ({ handleNext, handleBack }) => {
  const [expirationDate, setExpirationDate] = useState("");
  const [includeICP, setIncludeICP] = useState(true);
  const [icpAmount, setIcpAmount] = useState("");
  const [enabled, setEnabled] = useState(false);
  const [walletOptions, setWalletOptions] = useState({
    internetIdentity: false,
    plugWallet: false,
    other: false,
  });

  const [hour, setHour] = useState();
  const [minute, setMinute] = useState();
  const [second, setSecond] = useState();

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (
      !walletOptions.internetIdentity &&
      !walletOptions.plugWallet &&
      !walletOptions.other
    ) {
      newErrors.walletOptions = "Please select at least one wallet option.";
    }

    if (!expirationDate) {
      newErrors.expirationDate = "Please select an expiration date.";
    }

    if (includeICP && !icpAmount) {
      newErrors.icpAmount = "Please specify the amount of ICP.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      console.log({ expirationDate, includeICP, icpAmount, walletOptions });
      handleNext();
    }
  };

  const handleWalletOptionChange = (option) => {
    setWalletOptions({
      ...walletOptions,
      [option]: !walletOptions[option],
    });
  };

  const pageVariants = {
    initial: {
      opacity: 0,
      x: "-100vw",
    },
    in: {
      opacity: 1,
      x: 0,
    },
    out: {
      opacity: 0,
      x: "100vw",
    },
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.8,
  };

  return (
    <>
      <motion.div
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
        className="flex justify-between"
      >
        <div className="p-6 sm:w-[70%] space-y-6">
          <h1 className="text-3xl font-semibold">Wallet option</h1>
          <div>
            <p className="font-semibold text-sm text-gray-400 my-4">
              Select the wallet that will be highlighted as "recommended"
            </p>
            <div className="mt-2 flex flex-col space-y-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="wallet"
                  className="form-radio"
                  style={{ backgroundColor: "#5542F6" }}
                />
                <span className="ml-2">Internet Identity</span>
              </label>
              <label className="inline-flex items-center">
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

          <div className="flex flex-col">
            <p className="font-semibold text-sm text-gray-400 my-4">
              Select the wallets user will see as other connection options
            </p>
            <div className="mt-2 flex space-y-4 flex-col">
              <label className="inline-flex items-center">
                <Checkbox
                  checked={walletOptions.internetIdentity}
                  onChange={() => handleWalletOptionChange("internetIdentity")}
                  className="group block size-4 rounded border bg-white data-[checked]:bg-[#5542F6]"
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
              <label className="inline-flex items-center">
                <Checkbox
                  checked={walletOptions.plugWallet}
                  onChange={() => handleWalletOptionChange("plugWallet")}
                  className="group block size-4 rounded border bg-white data-[checked]:bg-[#5542F6]"
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
              <label className="inline-flex items-center">
                <Checkbox
                  checked={walletOptions.other}
                  onChange={() => handleWalletOptionChange("other")}
                  className="group block size-4 rounded border bg-white data-[checked]:bg-[#5542F6]"
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
            {errors.walletOptions && (
              <p className="text-red-500 text-sm mt-1">
                {errors.walletOptions}
              </p>
            )}
          </div>
          <div className="bg-gray-400 sm:w-[75%] my-8 border border-gray-300/2"></div>

          <div>
            <div className="flex items-center justify-between sm:w-[75%]">
              <p className="font-semibold text-lg">Link expiration</p>
              <Switch
                checked={enabled}
                onChange={setEnabled}
                className="group inline-flex h-6 w-12 items-center rounded-full bg-gray-200 transition"
              >
                <span className="size-4 translate-x-1 rounded-full bg-[#5542F6] transition group-data-[checked]:translate-x-7" />
              </Switch>
            </div>
            <p className="font-semibold text-sm text-gray-400 my-4">
              You can setup the link expiration, so that users will not be able
              to claim after a certain day and time
            </p>
            <div className="mt-6 space-y-4 sm:w-[75%]">
              <h1 className="text-lg font-semibold">Expiration Date</h1>
              <div className="flex md:flex-row flex-col w-full justify-between gap-4">
                <input
                  type="date"
                  name="startDate"
                  id="startDate"
                  className="bg-white px-2 py-2 outline-none border border-gray-200 sm:w-[73%] w-full rounded-md"
                  value={expirationDate}
                  onChange={(e) => setExpirationDate(e.target.value)}
                />
                <div className="flex md:justify-normal justify-between gap-4">
                  <select
                    name="startHour"
                    id="startHour"
                    className="bg-white w-full px-2 py-2 outline-none border border-gray-200 rounded-md"
                    value={hour}
                    onChange={(e) => setHour(e.target.value)}
                  >
                    {Array.from({ length: 24 }, (_, i) => i).map((hr) => (
                      <option key={hr} value={hr}>
                        {hr}
                      </option>
                    ))}
                  </select>
                  <select
                    name="startMinute"
                    id="startMinute"
                    className="bg-white w-full px-2 py-2 outline-none border border-gray-200 rounded-md"
                    value={minute}
                    onChange={(e) => setMinute(e.target.value)}
                  >
                    {Array.from({ length: 60 }, (_, i) => i).map((min) => (
                      <option key={min} value={min}>
                        {min}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {errors.expirationDate && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.expirationDate}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <TbInfoHexagon className="text-[#564BF1]" size={20} />
              <p className="text-sm text-gray-500">Enter expiration date</p>
            </div>
            <div className="bg-gray-400 sm:w-[75%] my-8 border border-gray-300/2"></div>
          </div>

          <div>
            <div className="flex items-center justify-between sm:w-[75%]">
              <p className="font-semibold text-lg">Include extra ICP</p>
              <Switch
                checked={includeICP}
                onChange={setIncludeICP}
                className="group inline-flex h-6 w-12 items-center rounded-full bg-gray-200 transition"
              >
                <span className="size-4 translate-x-1 rounded-full bg-[#5542F6] transition group-data-[checked]:translate-x-7" />
              </Switch>
            </div>
            <div className="mt-2">
              <span className="font-semibold text-gray-400 text-sm">
                Include native tokens to each link as an extra bonus for the
                receiver
              </span>

              {includeICP && (
                <div>
                  <p className="text-gray-900 text-lg font-semibold mt-4">
                    ICP to include
                  </p>
                  <input
                    type="text"
                    className="sm:w-[75%] mt-4 w-full h-12 rounded border-2 px-3 outline-none border-gray-100"
                    placeholder="Amount of ICP"
                    value={icpAmount}
                    onChange={(e) => setIcpAmount(e.target.value)}
                  />
                  {errors.icpAmount && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.icpAmount}
                    </p>
                  )}
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 mt-3">
              <TbInfoHexagon className="text-[#564BF1]" size={20} />
              <p className="text-sm text-gray-500">
                This amount of native tokens will be included in each link as a
                bonus for the receiver
              </p>
            </div>
          </div>

          <div className="mt-16 flex space-x-3">
            <BackButton text={"Back"} onClick={handleBack} />
            <MainButton text={"Launch campaign"} onClick={handleSubmit} />
          </div>
        </div>
        <Summary />
      </motion.div>
    </>
  );
};

export default Launch;
