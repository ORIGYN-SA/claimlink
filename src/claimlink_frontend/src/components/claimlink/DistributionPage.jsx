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
  const [claimType, setClaimType] = useState("selectAll");
  const [sponsorGas, setSponsorGas] = useState(false);
  const [errors, setErrors] = useState({});
  const { backend } = useAuth();
  const [nftOptions, setNftOptions] = useState([]);
  const [tokenOptions, setTokenOptions] = useState([]);
  const [allTokens, setAllTokens] = useState([]);
  const [clid, setClid] = useState();
  const [loading, setLoading] = useState(false);
  const [selectManualLoading, setSelectManualLoading] = useState(false);
  const [selectAllLoading, setSelectAllLoading] = useState(false);
  const [isselected, setIsSelected] = useState(false);
  useEffect(() => {
    if (formData.collection) {
      setClid(formData.collection);
      console.log("coll", formData.collection);
    }
  }, [formData.collection, setFormData]);

  useEffect(() => {
    const loadAllTokens = async () => {
      try {
        setLoading(true);
        if (!clid) {
          console.error("clid is undefined or empty");
          return;
        }

        const id = Principal.fromText(clid);
        const allTokenIds = await backend.getTokens(id);
        console.log(allTokenIds);
        setAllTokens(allTokenIds);
      } catch (error) {
        console.error("Error loading tokens:", error);
      } finally {
        setLoading(false);
      }
    };

    if (backend && formData.contract && clid) {
      loadAllTokens();
    }
  }, [backend, formData.contract, clid]);

  const handleClaimTypeChange = async (type) => {
    setClaimType(type);
    setIsSelected(true);
    if (type === "selectAll") {
      setSelectAllLoading(true);
      try {
        const allNfts =
          formData.pattern === "transfer"
            ? allTokens.map((nft) => nft[0])
            : allTokens.map((token) => token[0]);

        setFormData({
          ...formData,
          tokenIds: allNfts,
        });
      } catch (error) {
        console.error("Error selecting all tokens:", error);
      } finally {
        setSelectAllLoading(false);
      }
    } else if (type === "selectManual") {
      setFormData({
        ...formData,
        tokenIds: [],
      });
      setSelectManualLoading(true);
      try {
        const id = Principal.fromText(clid);

        if (formData.pattern === "transfer") {
          const nftData = await backend.getAvailableTokensForCampaignPaginate(
            id,
            1,
            100
          );
          console.log(nftData, "available tokens");
          setNftOptions(
            nftData?.data.map((nft) => ({
              value: nft[0],
              label: nft[2],
            }))
          );
        } else if (formData.pattern === "mint") {
          const tokenData =
            await backend.getAvailableStoredTokensForCampaignPaginate(
              id,
              1,
              100
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
        console.error("Error loading tokens for manual selection:", error);
      } finally {
        setSelectManualLoading(false);
      }
    }
  };

  const handleSelectChange = (selectedOptions) => {
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
              disabled={selectAllLoading}
            >
              {selectAllLoading ? "Loading..." : "Select All"}
            </button>
            <button
              type="button"
              className="px-4 sm:px-3 py-1 sm:text-sm text-xs border bg-[#F6A554] text-white rounded-lg"
              onClick={() => handleClaimTypeChange("selectManual")}
              disabled={selectManualLoading}
            >
              {selectManualLoading ? "Loading..." : "Select Manual"}
            </button>
          </div>
        </div>

        {isselected && (
          <div className="sm:w-[75%] w-full space-y-3">
            <p className="text-gray-900 font-semibold">Tokens</p>
            <div className="relative">
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
                isDisabled={loading || selectManualLoading}
              />
              {loading && (
                <div className="absolute inset-0 flex justify-center items-center bg-white bg-opacity-50 z-20">
                  <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-8 w-8"></div>
                </div>
              )}
            </div>
            {claimType === "selectAll" && (
              <p className="text-base font-black">
                All token Selected by default :{" "}
                <span className="text-green-500">{allTokens.length}</span>
              </p>
            )}
            {errors.tokenIds && (
              <p className="text-red-500 text-sm mt-2">{errors.tokenIds}</p>
            )}
          </div>
        )}

        <p className="mb-6 text-sm text-gray-500 sm:w-[75%] w-full mt-4">
          If you have a big set of different tokens to distribute, you could
          also provide the information by a JSON file.
        </p>

        <div className="flex gap-4">
          <BackButton text="Back" type="button" onClick={handleBack} />
          <MainButton text="Continue" type="submit" />
        </div>
      </form>

      <div className="hidden sm:block h-full bg-white">
        <Summary formData={formData} />
      </div>
    </motion.div>
  );
};

export default DistributionPage;
