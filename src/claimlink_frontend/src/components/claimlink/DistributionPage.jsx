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
  const [loading, setLoading] = useState(false); // Add loading state

  useEffect(() => {
    if (formData.collection) {
      setClid(formData.collection);
      console.log("coll", formData.collection);
    }
  }, [formData.contract, setFormData]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true); // Start loader
        if (!clid) {
          console.error("clid is undefined or empty");
          return;
        }

        const id = Principal.fromText(clid);

        if (formData.pattern === "transfer") {
          const nftData = await backend.getAvailableTokensForCampaign(id);
          console.log(nftData, "available tokens");
          setNftOptions(
            nftData.map((nft) => ({
              value: nft[0],
              label: nft[2],
            }))
          );
        } else if (formData.pattern === "mint") {
          const tokenData = await backend.getAvailableStoredTokensForCampaign(
            id
          );
          console.log(tokenData);
          setTokenOptions(
            tokenData.map((token) => ({
              value: token[0],
              label: token[1],
            }))
          );
        }
      } catch (error) {
        console.error("Error loading tokens:", error);
      } finally {
        setLoading(false); // Stop loader
      }
    };

    if (backend && formData.contract && clid) {
      loadData();
    }
  }, [backend, formData.contract, clid]);

  const handleClaimTypeChange = (type) => {
    setClaimType(type);

    // "Select All" functionality
    if (type === "selectAll") {
      const allNfts =
        formData.pattern === "transfer"
          ? nftOptions.map((nft) => nft.value)
          : tokenOptions.map((token) => token.value);

      setFormData({
        ...formData,
        tokenIds: allNfts, // Store all token IDs in the form data
      });
    }
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
              className="px-4 sm:px-3 py-1 sm:text-sm text-xs border bg-[#5542F6] text-white rounded-lg"
              onClick={() => handleClaimTypeChange("selectAll")}
            >
              Select all
            </button>
          </div>
        </div>

        <div className="sm:w-[75%] w-full space-y-3">
          <p className="text-gray-900 font-semibold">Tokens</p>
          <div className="relative">
            {/* Show the select box with a loader inside if loading */}
            <Select
              value={formData.tokenIds?.map((id) =>
                (formData.pattern === "transfer"
                  ? nftOptions
                  : tokenOptions
                ).find((option) => option.value === id)
              )}
              onChange={handleSelectChange}
              options={
                formData.pattern === "transfer" ? nftOptions : tokenOptions
              }
              isMulti
              placeholder="Select Tokens"
              className={`${
                errors.tokenIds ? "border-red-500" : ""
              } relative z-10`}
              isDisabled={loading} // Disable the select if loading
            />

            {/* Loader displayed when data is being fetched */}
            {loading && (
              <div className="absolute inset-0 flex justify-center items-center bg-white bg-opacity-50 z-20">
                <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-8 w-8"></div>
              </div>
            )}
          </div>
          {errors.tokenIds && (
            <p className="text-red-500 text-sm mt-2">{errors.tokenIds}</p>
          )}
        </div>

        <p className="mb-6 text-sm text-gray-500 sm:w-[75%] w-full mt-4">
          If you have a big set of different tokens to distribute, you could
          also provide the information by a JSON file
        </p>

        <div className="flex gap-4">
          <BackButton text="Back" type="button" onClick={handleBack} />
          <MainButton text="Continue" type="submit" />
        </div>
      </form>

      <div className="hidden sm:block  h-full bg-white">
        <Summary formData={formData} />
      </div>
    </motion.div>
  );
};

export default DistributionPage;
