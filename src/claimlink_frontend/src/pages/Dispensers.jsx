// src/containers/Dispensers.jsx

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { GoPlus } from "react-icons/go";
import { IoSettingsOutline } from "react-icons/io5";
import { TfiPlus } from "react-icons/tfi";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../connect/useClient";
import ScrollToTop from "../common/ScroolToTop";
import { BsCopy } from "react-icons/bs";
import toast from "react-hot-toast";

const Dispensers = () => {
  const navigate = useNavigate();

  // State variables
  const [campaigns, setCampaigns] = useState([]);
  const [dispensers, setDispensers] = useState([]);
  const [campaignDetails, setCampaignDetails] = useState({});
  const [isLoadingCampaigns, setIsLoadingCampaigns] = useState(true);
  const [isLoadingDispensers, setIsLoadingDispensers] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const { backend } = useAuth();

  // Environment URL
  const url = process.env.PROD
    ? `https://${process.env.CANISTER_ID_CLAIMLINK_BACKEND}.icp0.io`
    : "http://localhost:3000";

  // Navigation to dispenser setup
  const handleDispenserSetup = () => {
    navigate("/dispensers/dispenser-setup");
  };

  // Fetch campaign details
  const fetchCampaignDetails = async (campaignId) => {
    try {
      const campaignData = await backend.getCampaignDetails(campaignId);
      return setCampaignDetails(campaignData);
    } catch (error) {
      console.error("Error fetching campaign details:", error);
      return null;
    }
  };

  // Fetch user campaigns
  const fetchUserCampaigns = async () => {
    try {
      const res = await backend.getUserCampaignsPaginate(0, 2);
      setCampaigns(res.data); // Assuming res is an array of campaigns
      console.log("Campaigns:", res);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      setError("Failed to load campaigns.");
    } finally {
      setIsLoadingCampaigns(false);
    }
  };

  const itemsPerPage = 7;
  // Fetch user dispensers
  const fetchUserDispensers = async (pageNumber = 1) => {
    try {
      setIsLoadingDispensers(true);
      const start = pageNumber - 1;
      const res = await backend.getUserDispensersPaginate(start, itemsPerPage);
      setDispensers(res.data); // Assuming res is an array of dispensers
      setTotalPages(parseInt(res.total_pages));
      console.log("Dispensers:", res);
    } catch (error) {
      console.error("Error fetching dispensers:", error);
      setError("Failed to load dispensers.");
    } finally {
      setIsLoadingDispensers(false);
    }
  };

  // Fetch all data
  useEffect(() => {
    const loadData = async () => {
      await fetchUserCampaigns();
    };

    if (backend) {
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [backend]);

  // Fetch dispensers after campaigns are loaded
  useEffect(() => {
    const loadDispensers = async () => {
      if (campaigns.length > 0) {
        await fetchUserDispensers(page);
      } else {
        setIsLoadingDispensers(false); // No dispensers to load
      }
    };

    loadDispensers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaigns, page]);

  const handlePageChange = (pageNumber) => {
    setPage(pageNumber); // Update the page number when user clicks on a page button
  };

  // Fetch campaign details after dispensers are loaded
  useEffect(() => {
    const loadCampaignDetails = async () => {
      if (dispensers.length > 0) {
        const detailsMap = {};
        for (const dispenser of dispensers) {
          const details = await fetchCampaignDetails(dispenser.campaignId);
          detailsMap[dispenser.campaignId] = details;
        }
        setCampaignDetails(detailsMap);
      }
    };

    loadCampaignDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispensers]);
  const datein = (timestamp) => {
    const date = new Date(Number(timestamp));
    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
    return formattedDate;
  };

  // Loader Component
  const Loader = () => (
    <div className="flex justify-center items-center mt-10">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#5542F6]"></div>
    </div>
  );

  // Function to convert nanoseconds to a readable date
  const convertNanosecondsToDate = (timestamp) => {
    try {
      let millisecondTimestamp;

      // Check if the input is in nanoseconds (e.g., more than 13 digits)
      if (typeof timestamp === "bigint" && timestamp > 9999999999999n) {
        // Convert nanoseconds to milliseconds
        millisecondTimestamp = Number(timestamp / 1000000n);
      } else {
        // Treat as milliseconds directly
        millisecondTimestamp = Number(timestamp);
      }

      const date = new Date(millisecondTimestamp);
      const options = {
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      };

      return date.toLocaleString("en-US", options);
    } catch (error) {
      console.error("Error converting timestamp:", error);
      return "Invalid Date";
    }
  };

  // Function to format date in YYYY-MM-DD
  const formatDate = (timestamp) => {
    let millisecondTimestamp;

    // Check if the input is in nanoseconds (more than 13 digits)
    if (typeof timestamp === "bigint" && timestamp > 9999999999999n) {
      // Convert nanoseconds to milliseconds
      millisecondTimestamp = Number(timestamp / 1000000n);
    } else {
      // Treat as milliseconds directly
      millisecondTimestamp = Number(timestamp);
    }

    const date = new Date(millisecondTimestamp);
    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;

    return formattedDate;
  };
  const fallbackCopy = (text) => {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand("copy");
      toast.success("Link copied to clipboard!"); // Alert to confirm the action
    } catch (err) {
      console.error("Fallback: Oops, unable to copy", err);
      toast.error("Failed to copy link.");
    }
    document.body.removeChild(textarea);
  };
  const handleCopy = (text) => {
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          toast.success("Link copied to clipboard!"); // Optional: Alert to confirm the action
        })
        .catch((err) => {
          console.error(
            "Failed to copy using Clipboard API, using fallback",
            err
          );
          fallbackCopy(text); // Use fallback if Clipboard API fails
        });
    } else {
      fallbackCopy(text); // Use fallback if Clipboard API is not available
    }
  };
  return (
    <>
      <ScrollToTop />
      <div className="p-6 bg-gray-100 min-h-screen">
        {isLoadingCampaigns || isLoadingDispensers ? (
          <Loader />
        ) : error ? (
          <div className="flex justify-center items-center mt-10">
            <div className="bg-red-100 text-red-700 p-4 rounded-lg">
              {error}
            </div>
          </div>
        ) : campaigns.length === 0 ? (
          // Prompt to create collection and mint NFTs if no campaigns
          <div className="flex justify-center items-center mt-10">
            <div className="bg-white shadow-lg rounded-lg p-8 max-w-md text-center">
              <TfiPlus className="mx-auto mb-6 text-[#5542F6]" size={48} />
              <h2 className="text-2xl font-semibold mb-4">
                No Campaigns Found
              </h2>
              <p className="text-gray-600 mb-6">
                You need to create a campaign before creating a dispenser.
              </p>
              <div className="flex justify-center space-x-4">
                <Link
                  to="/claim-link"
                  className="px-4 py-2 bg-[#5542F6] text-white rounded hover:bg-[#443cd8] transition-colors duration-200"
                >
                  Create Campaign
                </Link>
              </div>
            </div>
          </div>
        ) : (
          // Display dispensers grid
          <div>
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-[#2E2C34]">Dispensers</h2>
              <div className="flex items-center space-x-4">
                {/* New Dispenser Button for Mobile */}
                <div className="sm:hidden">
                  <button
                    onClick={handleDispenserSetup}
                    className="flex items-center text-sm gap-2 bg-[#564BF1] px-4 py-2 text-white rounded-md"
                  >
                    <GoPlus className="text-2xl" /> New Dispenser
                  </button>
                </div>
                {/* Filter Dropdown for Desktop */}

                {/* New Dispenser Button for Desktop */}
              </div>
            </div>
            <div className="sm:hidden ">
              {dispensers?.map((data, index) => (
                <motion.div
                  key={index}
                  // onClick={dispenserDetail}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1 }}
                  className="bg-white  py-4 mt-6 rounded-xl flex flex-col shadow-md"
                >
                  <Link to={`/dispensers/${data.id}`}>
                    <div className="px-6">
                      <div className="flex justify-between items-center ">
                        <div className="flex items-center gap-3">
                          <img
                            width="80px"
                            height="80px"
                            src="https://images.pexels.com/photos/3621234/pexels-photo-3621234.jpeg?auto=compress&cs=tinysrgb&w=600"
                            alt="Dispenser"
                            className="rounded-lg"
                          />
                          <div className="">
                            <h2 className=" text-sm font-bold text-[#2E2C34]  ">
                              {data?.title}
                            </h2>
                            <p className="text-[#84818A] md:text-sm text-xs line-clamp-1 ">
                              {convertNanosecondsToDate(data?.createdAt)}
                            </p>
                          </div>
                        </div>
                        <div>
                          <IoSettingsOutline className="w-6 h-6 text-[#84818A]" />
                        </div>
                      </div>
                      <div className="border bg-[#EBEAED] mt-6 w-full"></div>
                      <div className=" w-full">
                        <div className="flex w-full justify-start relative">
                          <div className="w-1/2 p-2 flex justify-start">
                            <div className="flex flex-col justify-start">
                              <p className="text-[#84818A] md:text-sm text-xs">
                                Status
                              </p>
                              <p
                                className={`text-xs font-bold mt-2 ${
                                  Object.keys(data?.status || {})[0] ===
                                  "Expired"
                                    ? "text-red-600" // For expired
                                    : Object.keys(data?.status || {})[0] ===
                                      "Ongoing"
                                    ? "text-blue-600" // For complete
                                    : "text-green-600" // Default for ongoing
                                }`}
                              >
                                {Object.keys(data?.status || {})[0]}{" "}
                              </p>
                            </div>
                          </div>
                          <div className="w-1/2 p-2 flex flex-col justify-start relative">
                            <div className="absolute left-0 top-0 bottom-0 w-px bg-[#EBEAED]"></div>
                            <div className="flex flex-col justify-start pl-4">
                              <p className="text-[#84818A] md:text-sm text-xs">
                                Start Date
                              </p>
                              <p className="text-[#2E2C34] font-semibold text-sm">
                                {formatDate(data?.startDate)}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="border bg-[#EBEAED]  w-full"></div>
                        <div className="flex flex-wrap  relative">
                          <div className="w-1/2 p-2 flex justify-start">
                            <div className="flex flex-col justify-start">
                              <p className="text-[#84818A] md:text-sm text-xs">
                                Duration
                              </p>
                              <p className="text-[#2E2C34] font-semibold text-sm">
                                {String(data?.duration)} Min
                              </p>
                            </div>
                          </div>
                          <div className="w-1/2 p-2 flex flex-col justify-start relative">
                            <div className="absolute left-0 top-0 bottom-0 w-px bg-[#EBEAED]"></div>
                            <div className="flex flex-col justify-start pl-4">
                              <p className="text-[#84818A] md:text-sm text-xs">
                                Links
                              </p>
                              <p className="text-[#2E2C34] font-semibold text-sm">
                                {campaignDetails[data?.campaignId]?.[0]
                                  .depositIndices.length ?? "1"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}

              {/* Next button */}
            </div>

            {/* Dispensers Grid  laptop view*/}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-5">
              {/* New Dispenser Card */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-[#E9E8FC] px-3  py-4 hidden  sm:block rounded-xl flex flex-col items-center justify-center cursor-pointer"
                onClick={handleDispenserSetup}
              >
                <div className="w-12 h-12 rounded-md bg-white flex items-center justify-center mx-auto mb-4">
                  <TfiPlus className="text-[#564BF1] w-5 h-5 font-semibold" />
                </div>
                <h2 className="text-lg font-semibold flex items-center justify-center text-[#5542F6] mb-2">
                  Create New Dispenser
                </h2>
                <p className="text-[#5542F6] text-xs px-4 text-center">
                  A dispenser is represented by a single link or QR code that
                  you can share for multiple users to scan to claim a unique
                  token.
                </p>
              </motion.div>

              {/* Existing Dispensers */}
              {dispensers?.map((dispenser) => (
                <motion.div
                  key={dispenser.id}
                  className={`p-4 sm:block hidden bg-white  cursor-pointer rounded-lg overflow-hidden ${
                    Object.keys(dispenser?.status || {})[0] === "Expired" ||
                    Object.keys(dispenser?.status || {})[0] === "Completed"
                      ? "pointer-events-none opacity-70 bg-gray-100" // Disable link and add opacity
                      : ""
                  }`}
                >
                  {/* Dispenser Title and Date */}
                  <h2 className="text-lg font-semibold text-[#2E2C34] mt-3">
                    {dispenser.title}
                  </h2>
                  <p className="text-xs text-[#84818A] mt-1">
                    {convertNanosecondsToDate(dispenser.createdAt)}
                  </p>
                  {/* Divider */}
                  <div className="border border-gray-300 my-4 w-full"></div>
                  {/* Dispenser Details */}
                  <div className="w-full">
                    <div className="flex justify-between">
                      <p className="text-xs text-[#84818A]">Status</p>
                      <p
                        className={`text-xs font-bold mt-2 ${
                          Object.keys(dispenser?.status || {})[0] === "Expired"
                            ? "text-red-600" // For expired
                            : Object.keys(dispenser?.status || {})[0] ===
                              "Ongoing"
                            ? "text-blue-600" // For complete
                            : "text-green-600" // Default for ongoing
                        }`}
                      >
                        {Object.keys(dispenser?.status || {})[0]}{" "}
                      </p>
                    </div>
                    <div className="flex justify-between mt-2">
                      <p className="text-xs text-[#84818A]">Start Date</p>
                      <p className="text-[#2E2C34] text-xs font-semibold truncate">
                        {formatDate(dispenser.startDate)}
                      </p>
                    </div>
                    <div className="flex justify-between mt-2">
                      <p className="text-xs text-[#84818A]">Duration</p>
                      <p className="text-[#2E2C34] text-xs font-semibold">
                        {String(dispenser.duration)} Min
                      </p>
                    </div>
                    <div className="flex justify-between mt-2">
                      <p className="text-xs text-[#84818A]">Links</p>
                      <p className="text-[#2E2C34] text-xs font-semibold">
                        {campaignDetails[dispenser.campaignId]?.depositIndices
                          .length ?? "1"}
                      </p>
                    </div>
                  </div>
                  <div className="border border-gray-300 my-4 w-full"></div>
                  <div className="flex mt-2 justify-between space-x-4">
                    <p
                      className="text-[#564BF1] text-sm underline gap-2 truncate flex items-center cursor-pointer"
                      onClick={() => {
                        handleCopy(
                          `https://claimlink.xyz/dispensers/${dispenser?.id}`
                        );
                      }}
                    >
                      <BsCopy className="text-[#564BF1] w-4 h-4" />
                      Copy Link
                    </p>
                    <Link
                      className="text-[#564BF1] text-sm underline gap-2 truncate flex items-center cursor-pointer"
                      to={
                        Object.keys(dispenser?.status || {})[0] === "Expired" ||
                        Object.keys(dispenser?.status || {})[0] === "Completed"
                          ? "#" // Disable link
                          : `/dispensers/${dispenser?.id}`
                      }
                    >
                      view details
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
            {totalPages > 1 && (
              <div className="flex justify-center mt-6 items-center space-x-2">
                {/* Prev button */}
                <button
                  className={`px-3 py-1 rounded ${
                    page === 1
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-gray-200"
                  }`}
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                >
                  Prev
                </button>

                {/* Page number buttons */}
                {totalPages <= 5 ? (
                  // Show all page numbers if totalPages <= 5
                  Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (pageNum) => (
                      <button
                        key={pageNum}
                        className={`mx-1 px-3 py-1 rounded ${
                          page === pageNum
                            ? "bg-[#564BF1] text-white"
                            : "bg-gray-200"
                        }`}
                        onClick={() => handlePageChange(pageNum)}
                      >
                        {pageNum}
                      </button>
                    )
                  )
                ) : (
                  <>
                    {/* First page */}
                    <button
                      onClick={() => handlePageChange(1)}
                      className={`mx-1 px-3 py-1 rounded ${
                        page === 1 ? "bg-[#564BF1] text-white" : "bg-gray-200"
                      }`}
                    >
                      1
                    </button>

                    {/* Ellipsis if there are skipped pages */}
                    {page > 3 && <span className="mx-1">...</span>}

                    {/* Pages near the current page */}
                    {page > 2 && page < totalPages - 1 && (
                      <>
                        <button
                          onClick={() => handlePageChange(page - 1)}
                          className={`mx-1 px-3 py-1 rounded ${
                            page === page - 1
                              ? "bg-[#564BF1] text-white"
                              : "bg-gray-200"
                          }`}
                        >
                          {page - 1}
                        </button>
                        <button
                          onClick={() => handlePageChange(page)}
                          className={`mx-1 px-3 py-1 rounded ${
                            page === page
                              ? "bg-[#564BF1] text-white"
                              : "bg-gray-200"
                          }`}
                        >
                          {page}
                        </button>
                        <button
                          onClick={() => handlePageChange(page + 1)}
                          className={`mx-1 px-3 py-1 rounded ${
                            page === page + 1
                              ? "bg-[#564BF1] text-white"
                              : "bg-gray-200"
                          }`}
                        >
                          {page + 1}
                        </button>
                      </>
                    )}

                    {/* Ellipsis if there are more pages ahead */}
                    {page < totalPages - 2 && <span className="mx-1">...</span>}

                    {/* Last page */}
                    <button
                      onClick={() => handlePageChange(totalPages)}
                      className={`mx-1 px-3 py-1 rounded ${
                        page === totalPages
                          ? "bg-[#564BF1] text-white"
                          : "bg-gray-200"
                      }`}
                    >
                      {totalPages}
                    </button>
                  </>
                )}

                {/* Next button */}
                <button
                  className={`px-3 py-1 rounded ${
                    page === totalPages
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-gray-200"
                  }`}
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Dispensers;
