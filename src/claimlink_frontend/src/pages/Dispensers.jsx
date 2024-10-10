// src/containers/Dispensers.jsx

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { GoPlus } from "react-icons/go";
import { IoSettingsOutline } from "react-icons/io5";
import { TfiPlus } from "react-icons/tfi";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../connect/useClient";
import ScrollToTop from "../common/ScroolToTop";

const Dispensers = () => {
  const navigate = useNavigate();

  // State variables
  const [campaigns, setCampaigns] = useState([]);
  const [dispensers, setDispensers] = useState([]);
  const [campaignDetails, setCampaignDetails] = useState({});
  const [isLoadingCampaigns, setIsLoadingCampaigns] = useState(true);
  const [isLoadingDispensers, setIsLoadingDispensers] = useState(true);
  const [error, setError] = useState(null);

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
      const res = await backend.getUserCampaigns();
      setCampaigns(res); // Assuming res is an array of campaigns
      console.log("Campaigns:", res);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      setError("Failed to load campaigns.");
    } finally {
      setIsLoadingCampaigns(false);
    }
  };

  // Fetch user dispensers
  const fetchUserDispensers = async () => {
    try {
      const res = await backend.getUserDispensers();
      setDispensers(res); // Assuming res is an array of dispensers
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
        await fetchUserDispensers();
      } else {
        setIsLoadingDispensers(false); // No dispensers to load
      }
    };

    loadDispensers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaigns]);

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
  const convertNanosecondsToDate = (nanosecondTimestamp) => {
    try {
      const millisecondTimestamp = Number(nanosecondTimestamp / 1000000n);
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
    const date = new Date(Number(timestamp));
    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
    return formattedDate;
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
                <div className="hidden sm:flex items-center">
                  <select
                    name="Filter"
                    id="filter"
                    className="border border-gray-400 px-2 py-1 rounded-md outline-none text-sm"
                  >
                    <option value="new">New</option>
                    <option value="old">Old</option>
                  </select>
                </div>
                {/* New Dispenser Button for Desktop */}
              </div>
            </div>
            <div className="sm:hidden ">
              {dispensers[0]?.map((data, index) => (
                <motion.div
                  key={index}
                  // onClick={dispenserDetail}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1 }}
                  className="bg-white  py-4 mt-6 rounded-xl flex flex-col shadow-md"
                >
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
                            <p className="text-red-500 font-medium text-sm">
                              Not Uploaded
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
                              {datein(data?.startDate)}
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
                </motion.div>
              ))}
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
                <h2 className="text-lg font-semibold text-[#5542F6] mb-2">
                  Create New Dispenser
                </h2>
                <p className="text-[#5542F6] text-xs px-4 text-center">
                  A dispenser is represented by a single link or QR code that
                  you can share for multiple users to scan to claim a unique
                  token.
                </p>
              </motion.div>

              {/* Existing Dispensers */}
              {dispensers[0]?.map((dispenser) => (
                <motion.div
                  key={dispenser.id}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1 }}
                  className="bg-white px-5 py-4  hidden sm:block rounded-xl flex flex-col cursor-pointer "
                >
                  <Link to={`/dispensers/${dispenser.id}`}>
                    <div className="flex justify-start  space-x-4">
                      <img
                        src="https://via.placeholder.com/100"
                        alt="Campaign"
                        className="w-12 h-12 object-cover rounded-md"
                        style={{
                          border: "2px solid white",
                          zIndex: 3,
                        }}
                      />
                      <img
                        src="https://via.placeholder.com/100"
                        alt="Campaign"
                        className="w-12 h-12 object-cover rounded-md"
                        style={{
                          border: "2px solid white",
                          zIndex: 2,
                          marginLeft: -24,
                        }}
                      />
                      <img
                        src="https://via.placeholder.com/100"
                        alt="Campaign"
                        className="w-12 h-12 object-cover rounded-md"
                        style={{
                          border: "2px solid white",
                          zIndex: 1,
                          marginLeft: -24,
                        }}
                      />
                    </div>
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
                        <p className="text-[#F95657] text-xs font-semibold">
                          Not Uploaded
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
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Dispensers;
