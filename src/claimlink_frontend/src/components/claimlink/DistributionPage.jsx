import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
  const [errors, setErrors] = useState({});
  const { backend } = useAuth();
  const [nftOptions, setNftOptions] = useState([]);
  const [allTokens, setAllTokens] = useState([]);
  const [selectedTokens, setSelectedTokens] = useState([]);
  const [clid, setClid] = useState(formData.collection || null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const itemsPerPage = 12; // Number of items per page

  useEffect(() => {
    const loadAllTokens = async () => {
      try {
        setLoading(true);
        if (!clid) return;
        const id = Principal.fromText(clid);
        const allTokenIds = await backend.getAllTokens(id);
        setAllTokens(allTokenIds);
        setSelectedTokens(allTokenIds.map((token) => token));
      } catch (error) {
        console.error("Error loading tokens:", error);
      } finally {
        setLoading(false);
      }
    };

    if (backend && clid) {
      loadAllTokens();
    }
  }, [backend, clid]);

  useEffect(() => {
    const loadPaginatedTokens = async () => {
      try {
        setLoading(true);
        if (!clid) return;
        const id = Principal.fromText(clid);
        if (formData.pattern === "transfer") {
          const nftData = await backend.getAvailableTokensForCampaignPaginate(
            id,
            page,
            itemsPerPage
          );

          setNftOptions(
            nftData?.data.map((nft) => ({
              id: nft[0],
              label: nft[2],
            }))
          );
        } else if (formData.pattern === "mint") {
          const nftData =
            await backend.getAvailableStoredTokensForCampaignPaginate(
              id,
              page,
              itemsPerPage
            );
          console.log("object,", nftData);
          setNftOptions(
            nftData?.data.map((nft) => ({
              id: nft[0],
              label: nft[1],
            }))
          );
        }

        setTotalPages(parseInt(nftData.total_pages));
      } catch (error) {
        console.error("Error loading paginated tokens:", error);
      } finally {
        setLoading(false);
      }
    };

    if (claimType === "selectManual" && clid) {
      loadPaginatedTokens();
    }
  }, [backend, clid, claimType, page]);

  const handleClaimTypeChange = (type) => {
    setClaimType(type);
    if (type === "selectAll") {
      setSelectedTokens(allTokens.map((token) => token[0]));
      setFormData({
        ...formData,
        tokenIds: allTokens.map((token) => token[0]),
      });
    } else if (type === "selectManual") {
      setSelectedTokens([]);
      setFormData({ ...formData, tokenIds: [] });
    }
  };

  const toggleTokenSelection = (tokenId) => {
    setSelectedTokens((prev) =>
      prev.includes(tokenId)
        ? prev.filter((id) => id !== tokenId)
        : [...prev, tokenId]
    );
  };

  const selectAllInPage = () => {
    const tokensInPage = nftOptions.map((nft) => nft.id);
    setSelectedTokens((prev) => [...new Set([...prev, ...tokensInPage])]);
  };

  const validate = () => {
    const tempErrors = {
      tokenIds: selectedTokens.length
        ? ""
        : "You must select at least one token.",
    };
    setErrors(tempErrors);
    return Object.values(tempErrors).every((x) => x === "");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      setFormData({ ...formData, tokenIds: selectedTokens });
      handleNext();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: "-100vw" }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: "100vw" }}
      transition={{ type: "tween", ease: "anticipate", duration: 0.8 }}
      className="flex justify-between"
    >
      <form onSubmit={handleSubmit} className="p-8 sm:w-[70%] w-full">
        <h2 className="text-2xl font-semibold mb-4">Distribution</h2>
        <p className="text-sm text-gray-500 mb-8">
          Choose the desired claim pattern and proceed with the appropriate
          transaction.
        </p>

        <div className="mb-4 sm:flex justify-between sm:w-[75%]">
          <h3 className="font-semibold mb-2">Add token IDs to distribute</h3>
          <div className="flex gap-4">
            <button
              type="button"
              className="px-4 py-1 bg-blue-500 text-white rounded-lg"
              onClick={() => handleClaimTypeChange("selectAll")}
            >
              Select All
            </button>

            <button
              type="button"
              className="px-4 py-1 bg-orange-500 text-white rounded-lg"
              onClick={() => handleClaimTypeChange("selectManual")}
            >
              Select Manual
            </button>
          </div>
        </div>
        {formData.pattern == "transfer"
          ? claimType === "selectAll" &&
            (loading ? (
              <div className="border text-gray-500 text-lg font-semibold  p-4 border-gray-400 rounded-lg">
                Loading...{" "}
              </div>
            ) : (
              <div className="border text-gray-500 text-lg font-semibold  p-4 border-gray-400 rounded-lg">
                All token is selected in Collection :{" "}
                <span className="text-blue-400">{selectedTokens.length}</span>
              </div>
            ))
          : claimType === "selectAll" && (
              <div className="border text-gray-500 text-lg font-semibold  p-4 border-gray-400 rounded-lg">
                Please Select manually for mint*
              </div>
            )}

        {claimType === "selectManual" && (
          <div className="border p-4 border-gray-400 rounded-lg">
            <div className="flex justify-between mb-2">
              <h3 className="text-lg font-semibold">Tokens</h3>
              <button
                type="button"
                onClick={selectAllInPage}
                className="text-blue-500 underline"
              >
                Select all in page
              </button>
            </div>
            <div className="grid grid-cols-4 gap-4 max-h-60 overflow-y-auto p-2">
              {loading ? (
                <div className="flex items-center justify-center w-full h-full">
                  <p>Loading...</p>
                </div>
              ) : nftOptions.length > 0 ? (
                nftOptions.map((nft, index) => (
                  <div key={index} className="flex items-center justify-center">
                    <input
                      type="checkbox"
                      checked={selectedTokens.includes(nft.id)}
                      onChange={() => toggleTokenSelection(nft.id)}
                      id={`token-${nft.id}`}
                    />
                    <label htmlFor={`token-${nft.id}`} className="ml-2">
                      {nft.label}
                    </label>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center w-full h-full">
                  <p>No NFTs available.</p>
                </div>
              )}
            </div>

            <div className="flex justify-between mt-4">
              <button
                type="button"
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
              >
                {"< Previous"}
              </button>
              <button
                type="button"
                onClick={() =>
                  setPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={page === totalPages}
              >
                {"Next >"}
              </button>
            </div>
          </div>
        )}

        {errors.tokenIds && (
          <p className="text-red-500 text-sm mt-2">{errors.tokenIds}</p>
        )}

        <div className="flex gap-4 mt-6">
          <BackButton text="Back" onClick={handleBack} />
          <MainButton text="Continue" type="submit" />
        </div>
      </form>

      <div className="hidden sm:block bg-white">
        <Summary formData={formData} />
      </div>
    </motion.div>
  );
};

export default DistributionPage;
