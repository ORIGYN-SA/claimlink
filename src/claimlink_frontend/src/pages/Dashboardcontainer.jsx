// src/containers/DashboardContainer.jsx

import React, { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import { IoIosArrowDown, IoIosAdd } from "react-icons/io";
import { IoSettingsOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { TfiPlus } from "react-icons/tfi";
import { useAuth } from "../connect/useClient";
import Breadcrumb from "../components/Breadcrumb"; // Ensure this component exists
import ScrollToTop from "../common/ScroolToTop";

const DashboardContainer = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [collections, setCollections] = useState([]);
  const [isLoadingCampaigns, setIsLoadingCampaigns] = useState(true);
  const [isLoadingCollections, setIsLoadingCollections] = useState(true);
  const { backend } = useAuth();

  // Fetch user campaigns
  const getCampaigns = async () => {
    try {
      const res = await backend.getUserCampaigns();
      setCampaigns(res[0]); // Assuming res is an array of campaigns
      console.log(res, "campaigns");
    } catch (error) {
      console.error("Error in getting campaigns:", error);
    } finally {
      setIsLoadingCampaigns(false);
    }
  };

  // Fetch user collections
  const getCollections = async () => {
    try {
      const res = await backend.getUserCollections();
      setCollections(res); // Assuming res is an array of collections
      console.log(res, "collections");
    } catch (error) {
      console.error("Error in getting collections:", error);
    } finally {
      setIsLoadingCollections(false);
    }
  };

  useEffect(() => {
    if (backend) {
      getCampaigns();
      getCollections();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [backend]);

  // Loader Component
  const Loader = () => (
    <div className="flex justify-center items-center mt-10">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#5542F6]"></div>
    </div>
  );

  return (
    <>
      <ScrollToTop />
      <div className="min-h-screen p-4 bg-gray-100">
        {/* Header Section */}
        <div className="bg-[#5542F6] hidden sm:block rounded-xl h-24 mb-6 m-2"></div>
        <div className="flex  sm:flex-row items-center justify-between w-full p-2 mb-6">
          <p className="text-2xl font-bold text-gray-800">Campaigns</p>
          <div className="flex items-center  sm:mt-0">
            {/* New Campaign Button for Mobile */}
            <div className="sm:hidden mr-4">
              <Link
                to="/campaign-setup"
                className="flex items-center justify-center text-sm border-[#5542F6] bg-[#5542F6] gap-2 px-4 py-2 border rounded capitalize text-white"
              >
                <IoIosAdd size={20} />
                New Campaign
              </Link>
            </div>
            {/* Filter Dropdown for Desktop */}
            <div className="hidden sm:flex items-center">
              <select
                name="Filter"
                id="filter"
                className="flex items-center justify-center outline-none gap-2 px-4 py-2 border border-gray-500 rounded-md capitalize bg-white text-gray-700"
              >
                <option value="new">New</option>
                <option value="old">Old</option>
              </select>
            </div>
          </div>
        </div>

        {/* Conditional Rendering Based on Loading and Collections */}
        {isLoadingCampaigns || isLoadingCollections ? (
          <Loader />
        ) : collections.length === 0 ? (
          // Message Box When No Collections Exist
          <div className="flex justify-center items-center mt-10">
            <div className="bg-white shadow-lg rounded-lg p-8 max-w-md text-center">
              <TfiPlus className="mx-auto mb-6 text-[#5542F6]" size={48} />
              <h2 className="text-2xl font-semibold mb-4">
                No Collections Found
              </h2>
              <p className="text-gray-600 mb-6">
                You need to create a collection and mint NFTs before creating a
                campaign.
              </p>
              <div className="flex justify-center space-x-4">
                <Link
                  to="/minter"
                  className="px-4 py-2 bg-[#5542F6] text-white rounded hover:bg-[#443cd8] transition-colors duration-200"
                >
                  Create Collection
                </Link>
              </div>
            </div>
          </div>
        ) : (
          // Campaigns Grid
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {/* New Campaign Card */}
            <Link to="/campaign-setup" className="w-full">
              <NewCampaignCard />
            </Link>
            {/* Existing Campaigns */}
            {campaigns?.map((campaign) => (
              <div key={campaign.id} className="w-full ">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <CampaignCard campaign={campaign} />
                </motion.div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

const NewCampaignCard = () => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="h-full hidden sm:block"
    >
      <div className="flex flex-col items-center justify-center rounded-lg h-[370px] bg-[#dad6f797] text-center   transition-shadow duration-300">
        <div className="w-16 h-16 rounded-md bg-white flex items-center justify-center mb-6">
          <TfiPlus className="text-[#5542F6] w-6 h-6" />
        </div>
        <h2 className="text-xl font-semibold text-[#5542F6] mb-2">
          New Campaign
        </h2>
        <p className="text-[#5542F6] text-sm px-4">
          Create a campaign to distribute your NFTs via claim links.
        </p>
      </div>
    </motion.div>
  );
};

const CampaignCard = ({ campaign }) => {
  function convertNanosecondsToDate(nanosecondTimestamp) {
    // Convert nanoseconds to milliseconds
    const millisecondTimestamp = Number(nanosecondTimestamp / 1000000n);

    // Create a Date object
    const date = new Date(millisecondTimestamp);

    // Define options for formatting the date
    const options = {
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };

    // Format the date to a human-readable string
    return date.toLocaleString("en-US", options);
  }
  return (
    <>
      <Link
        className="max-w-sm mx-auto   bg-white  cursor-pointer   rounded-lg overflow-hidden"
        to={`/claim-link/${campaign?.id}`}
      >
        <div className="max-w-sm sm:hidden mx-auto bg-white rounded-lg   p-4">
          <div className="flex items-center justify-between mb-4">
            <div className=" flex gap-2 items-center  justify-between w-full ">
              <div className="flex gap-2">
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
                </div>
                <div>
                  <h2 className="text-lg font-semibold">{campaign?.title}</h2>

                  <h2 className="text-lg font-semibold">
                    {Object.keys(campaign?.status || {})}
                  </h2>

                  <p className="text-sm text-gray-500">
                    {" "}
                    {convertNanosecondsToDate(campaign?.createdAt)}
                  </p>
                </div>
              </div>
              <IoSettingsOutline size={24} className="text-gray-400  " />
            </div>
          </div>
          <div className="grid grid-cols-2 ">
            {/* <div className="flex flex-col  border-l-0 py-2 border-b-0 border  border-gray-300 items-start">
            <span className="text-sm text-gray-500">Token</span>
            <span className="font-medium">EXT</span>
          </div>
          <div className="flex justify-between border-b-0 border p-2  border-r-0   border-gray-300 ">
            <div className="flex flex-col items-start">
              <span className="text-sm text-gray-500">Claimed</span>
              <span className="font-medium">100/100</span>
            </div>
            <div className="w-12 h-12 rounded-full bg-white border-4 border-r-gray-200 border-t-gray-200 border-[#5542F6] flex items-center justify-center"></div>
          </div> */}
            <div className="flex flex-col items-start border-l-0 py-2 border-b-0 border  border-gray-300">
              <span className="text-sm text-gray-500">Contract</span>
              <span className="font-medium text-[#5542F6] line-clamp-1">
                {" "}
                {campaign?.collection.toText()}
              </span>
            </div>
            <div className="flex flex-col items-start border-b-0 border p-2  border-r-0   border-gray-300">
              <span className="text-sm text-gray-500">Network</span>
              <span className="font-medium">Internet Computer</span>
            </div>
            <div className="flex flex-col items-start border-l-0 py-2 border-b-0 border  border-gray-300">
              <span className="text-sm text-gray-500">Token standard</span>
              <span className="font-medium">{campaign?.tokenType}</span>
            </div>
            <div className="flex flex-col items-start border-b-0 border p-2  border-r-0   border-gray-300">
              <span className="text-sm text-gray-500">Links</span>
              <span className="font-medium">{campaign?.tokenIds?.length}</span>
            </div>
            <div className="flex flex-col items-start border-l-0 py-2 border-b-0 border  border-gray-300">
              <span className="text-sm text-gray-500">Sponsorship</span>
              <span className="font-medium">Disable</span>
            </div>
            <div className="flex flex-col items-start border-b-0 border p-2  border-r-0   border-gray-300">
              <span className="text-sm text-gray-500">Claim pattern</span>
              <span className="font-medium">{campaign?.claimPattern}</span>
            </div>
          </div>
        </div>
      </Link>
      <Link
        className="max-w-sm mx-auto sm:block hidden bg-white  cursor-pointer   rounded-lg overflow-hidden"
        to={`/claim-link/${campaign?.id}`}
      >
        <div className="relative h-12 mt-6 px-6">
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
          </div>
        </div>
        <div className="px-6 py-4">
          <div className="flex justify-between">
            <div className="font-semibold text-lg mb-2">{campaign?.title}</div>
            <p className="text-xs text-green-600 font-bold mt-2">
              {Object.keys(campaign?.status || {})[0]}{" "}
              {/* Displays "Ongoing" */}
            </p>
          </div>

          <p className="text-gray-500 text-xs">
            {convertNanosecondsToDate(campaign?.createdAt)}
          </p>
          <hr className="my-4" />
          <div className="text-xs">
            <div className="flex justify-between py-1">
              <span className="text-gray-500">Contract</span>
              <span className="text-blue-500 font-semibold line-clamp-1 w-24">
                {campaign?.collection.toText()}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-gray-500">Network</span>
              <span className="font-semibold">Internet Computer</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-gray-500">Token standard</span>
              <span className="font-semibold">{campaign?.tokenType}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-gray-500">Links</span>
              <span className="font-semibold">{campaign?.tokenIds.length}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-gray-500">Claims</span>
              <span className="font-semibold">0</span>
            </div>
            <hr className="my-2" />

            <div className="flex justify-between py-1">
              <span className="text-gray-500">Sponsorship</span>
              <span className="font-semibold">Disable</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-gray-500">Claim pattern</span>
              <span className="font-semibold">{campaign?.claimPattern}</span>
            </div>
          </div>
        </div>
      </Link>
    </>
  );
};
export default DashboardContainer;
