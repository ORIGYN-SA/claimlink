import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Select from "react-select";
import MainButton, { BackButton } from "../../common/Buttons";
import Summary from "./Summary";
import { useAuth } from "../../connect/useClient";
import { Principal } from "@dfinity/principal";

const DistributionPage = ({
  handleNext,
  handleBack,
  formData,
  setFormData,
}) => {
  const [claimType, setClaimType] = useState("");
  const [sponsorGas, setSponsorGas] = useState(false);
  const [errors, setErrors] = useState({});
  const { backend } = useAuth();
  const [nftOptions, setNftOptions] = useState([]);
  const [tokenOptions, setTokenOptions] = useState([]);
  const [clid, setClid] = useState();
  const [type, setType] = useState();

  useEffect(() => {
    if (formData.collection) {
      setClid(formData.collection);
      console.log("coll", formData.collection);
    }
  }, [formData.contract, setFormData]);

  console.log(backend);
  useEffect(() => {
    const loadData = async () => {
      try {
        if (!clid) {
          console.error("clid is undefined or empty");
          return;
        }

        console.log("clid:", clid);
        const id = Principal.fromText(clid);

        if (formData.pattern === "transfer") {
          const nftData = await backend.getNonFungibleTokens(id);
          setNftOptions(
            nftData.map((nft) => ({
              value: nft[0].toString(),
              label: nft[2].nonfungible.name,
            }))
          );
        } else if (formData.pattern === "mint") {
          const tokenData = await backend.getStoredTokens(id);
          setTokenOptions(
            tokenData[0].map((token) => ({
              value: token[0].toString(),
              label: token[1].nonfungible.name,
            }))
          );
        }
      } catch (error) {
        console.error("Error loading tokens:", error);
      }
    };

    if (backend && formData.contract && clid) {
      loadData();
    }
  }, [backend, formData.contract, clid]);

  const handleClaimTypeChange = (type) => {
    setClaimType(type);
  };

  const handleSponsorGasChange = (sponsor) => {
    setSponsorGas(sponsor);
  };

  const handleSelectChange = (selectedOptions) => {
    // Store selected token IDs in an array
    setFormData({
      ...formData,
      tokenIds: selectedOptions
        ? selectedOptions.map((option) => option.value)
        : [],
    });
  };

  const validate = () => {
    let tempErrors = {};
    tempErrors.tokenIds =
      formData.tokenIds && formData.tokenIds.length > 0
        ? ""
        : "Token IDs are required.";
    setErrors(tempErrors);
    return Object.values(tempErrors).every((x) => x === "");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      handleNext();
    }
  };

  const pageVariants = {
    initial: { opacity: 0, x: "-100vw" },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: "100vw" },
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.8,
  };

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="flex justify-between"
    >
      <form onSubmit={handleSubmit} className="p-8 sm:w-[70%] w-full">
        <h2 className="text-2xl text-gray-900 font-semibold mb-4">
          Distribution
        </h2>
        <p className="text-gray-500 text-sm mt-4 mb-8">
          Choose the desired claim pattern and proceed with the appropriate
          transaction to enable it
        </p>

        <div className="mb-4 sm:flex justify-between sm:w-[75%] w-full">
          <h3 className="sm:text-lg font-semibold mb-2">
            Add token IDs to distribute
          </h3>
          <div className="flex sm:justify-between gap-4">
            <button
              type="button"
              className="px-4 sm:px-3 py-1 border sm:text-sm text-xs bg-[#dad6f797] text-[#5542F6] rounded-lg"
              onClick={() => handleClaimTypeChange("manual")}
            >
              Set manually
            </button>
            <button
              type="button"
              className="px-4 sm:px-3 py-1 sm:text-sm text-xs border bg-[#5542F6] text-white rounded-lg"
              onClick={() => handleClaimTypeChange("selectAll")}
            >
              Select all
            </button>
          </div>
        </div>

        <div className="sm:w-[75%] w-full space-y-3">
          <p className="text-gray-900 font-semibold">Collection</p>
          <Select
            value={formData.tokenIds?.map((id) =>
              nftOptions.find((option) => option.value === id)
            )}
            onChange={handleSelectChange}
            options={
              formData.pattern === "transfer" ? nftOptions : tokenOptions
            }
            isMulti
            placeholder="Select Collection"
            className={`${errors.tokenIds ? "border-red-500" : ""}`}
          />
          {errors.tokenIds && (
            <p className="text-red-500 text-sm mt-2">{errors.tokenIds}</p>
          )}
        </div>

        <p className="mb-6 text-sm text-gray-500 sm:w-[75%] w-full mt-4">
          If you have a big set of different tokens to distribute, you could
          also provide the information by a JSON file
        </p>

        <div className="flex gap-4">
          <BackButton text="back" type="button" onClick={handleBack} />
          <MainButton text="Continue" type="submit" />
        </div>
      </form>

      <div className="hidden sm:block w-[30%] h-full bg-white">
        <Summary formData={formData} />
      </div>
    </motion.div>
  );
};

export default DistributionPage;
