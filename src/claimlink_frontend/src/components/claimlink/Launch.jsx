import React, { useState } from "react";
import { Checkbox, Switch } from "@headlessui/react";
import { motion } from "framer-motion";
import { TbInfoHexagon } from "react-icons/tb";
import Summary from "./Summary";
import MainButton, { BackButton } from "../../common/Buttons";
import { useAuth } from "../../connect/useClient";
import { Principal } from "@dfinity/principal";
import toast from "react-hot-toast";

const Launch = ({ handleNext, handleBack, formData, setFormData }) => {
  const [errors, setErrors] = useState({});
  const { identity, backend, principal } = useAuth();

  const validateForm = () => {
    const newErrors = {};

    if (
      !formData.walletOptions.internetIdentity &&
      !formData.walletOptions.plugWallet &&
      !formData.walletOptions.other
    ) {
      newErrors.walletOptions = "Please select at least one wallet option.";
    }

    if (!formData.expirationDate) {
      newErrors.expirationDate = "Please select an expiration date.";
    }

    if (formData.includeICP && !formData.icpAmount) {
      newErrors.icpAmount = "Please specify the amount of ICP.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      console.log(formData);
      handleNext();
    }
  };

  const handleWalletOptionChange = (option) => {
    setFormData({
      ...formData,
      walletOptions: {
        ...formData.walletOptions,
        [option]: !formData.walletOptions[option],
      },
    });
  };

  const handleIncludeICPChange = (include) => {
    setFormData({ ...formData, includeICP: include });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    console.log("Starting campaign creation");

    if (!backend) {
      toast.error("Backend actor not initialized");
      return;
    }

    if (!validateForm()) {
      return;
    }

    try {
      console.log("Form data:", formData);
      console.log("Principal:", principal.toText());

      const collectionPrincipal = Principal.fromText(formData.collection);
      const tokenIds = Number(formData.tokenIds.value);

      const selectedWalletOptions = Object.keys(formData.walletOptions)
        .filter((option) => formData.walletOptions[option])
        .map((option) => {
          switch (option) {
            case "internetIdentity":
              return "internetidentity";
            case "plugWallet":
              return "plug";
            case "other":
              return "other";

            default:
              return option;
          }
        });

      console.log(selectedWalletOptions);

      const date = new Date(
        `${formData.expirationDate}T${formData.hour}:${formData.minute}:00Z`
      );
      const timestampMillis = date.getTime();

      const res = await backend?.createCampaign(
        formData.title,
        formData.tokenType,
        collectionPrincipal,
        formData.pattern,
        [tokenIds],
        formData.walletOption,
        selectedWalletOptions,
        "23-8-2025"
      );

      if (res) {
        console.log("Campaign created successfully:", res);
        toast.success("Campaign created successfully!");
        handleNext();
      } else {
        console.log("Failed to create campaign, no response received");
        toast.error("Failed to create campaign");
      }
    } catch (error) {
      console.error("Error creating campaign:", error);
      toast.error(`Error creating campaign: ${error.message}`);
    }
  };

  const pageVariants = {
    initial: { opacity: 0, x: "-100vw" },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: "100vw" },
  };

  const pageTransition = { type: "tween", ease: "anticipate", duration: 0.8 };

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="flex justify-between"
    >
      <div className="p-6 sm:w-[70%] space-y-6">
        <h1 className="text-3xl font-semibold">Wallet Option</h1>
        <div>
          <p className="font-semibold text-sm text-gray-400 my-4">
            Select the wallet that will be highlighted as "recommended"
          </p>
          <div className="mt-2 flex flex-col space-y-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="wallet"
                checked={formData.walletOptions.internetIdentity}
                onChange={() => handleWalletOptionChange("internetIdentity")}
                className="form-radio"
                style={{ backgroundColor: "#5542F6" }}
              />
              <span className="ml-2">Internet Identity</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="wallet"
                checked={formData.walletOptions.plugWallet}
                onChange={() => handleWalletOptionChange("plugWallet")}
                className="form-radio"
              />
              <span className="ml-2">Plug Wallet</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="wallet"
                checked={formData.walletOptions.other}
                onChange={() => handleWalletOptionChange("other")}
                className="form-radio"
              />
              <span className="ml-2">Other</span>
            </label>
          </div>
          {errors.walletOptions && (
            <p className="text-red-500 text-sm mt-1">{errors.walletOptions}</p>
          )}
        </div>

        <div className="bg-gray-400 sm:w-[75%] my-8 border border-gray-300/2"></div>

        <div>
          <div className="flex items-center justify-between sm:w-[75%]">
            <p className="font-semibold text-lg">Link Expiration</p>
            <Switch
              checked={formData.enabled}
              onChange={(enabled) => setFormData({ ...formData, enabled })}
              className="group inline-flex h-6 w-12 items-center rounded-full bg-gray-200 transition"
            >
              <span className="size-4 translate-x-1 rounded-full bg-[#5542F6] transition group-data-[checked]:translate-x-7" />
            </Switch>
          </div>
          <p className="font-semibold text-sm text-gray-400 my-4">
            You can set up the link expiration, so that users will not be able
            to claim after a certain day and time
          </p>
          <div className="mt-6 space-y-4 sm:w-[75%]">
            <h1 className="text-lg font-semibold">Expiration Date</h1>
            <div className="flex md:flex-row flex-col w-full justify-between gap-4">
              <input
                type="date"
                name="expirationDate"
                id="expirationDate"
                className="bg-white px-2 py-2 outline-none border border-gray-200 sm:w-[73%] w-full rounded-md"
                value={formData.expirationDate}
                onChange={(e) =>
                  setFormData({ ...formData, expirationDate: e.target.value })
                }
              />
              <div className="flex md:justify-normal justify-between gap-4">
                <select
                  name="startHour"
                  id="startHour"
                  className="bg-white w-full px-2 py-2 outline-none border border-gray-200 rounded-md"
                  value={formData.hour}
                  onChange={(e) =>
                    setFormData({ ...formData, hour: e.target.value })
                  }
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
                  value={formData.minute}
                  onChange={(e) =>
                    setFormData({ ...formData, minute: e.target.value })
                  }
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
            <p className="font-semibold text-lg">Include Extra ICP</p>
            <Switch
              checked={formData.includeICP}
              onChange={handleIncludeICPChange}
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
            {formData.includeICP && (
              <div>
                <p className="text-gray-900 text-lg font-semibold mt-4">
                  ICP to Include
                </p>
                <input
                  type="text"
                  className="sm:w-[75%] mt-4 w-full h-12 rounded border-2 px-3 outline-none border-gray-100"
                  placeholder="Amount of ICP"
                  value={formData.icpAmount}
                  onChange={(e) =>
                    setFormData({ ...formData, icpAmount: e.target.value })
                  }
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
          <MainButton text={"Launch Campaign"} onClick={handleCreate} />
        </div>
      </div>
      <Summary formData={formData} />
    </motion.div>
  );
};

export default Launch;
