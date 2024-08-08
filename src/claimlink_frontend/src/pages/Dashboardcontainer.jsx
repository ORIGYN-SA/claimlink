import React from "react";
import { FaPlus } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { IoSettingsOutline } from "react-icons/io5";
import { IoIosAdd } from "react-icons/io";
import { useState, useEffect } from "react";
import Breadcrumb from "../components/Breadcrumb";
import { TfiPlus } from "react-icons/tfi";
import { useAuth } from "../connect/useClient";
const DashboardContainer = () => {
  const [campaign, setCampaign] = useState();

  const { backend } = useAuth();

  const getCampaign = async () => {
    try {
      const res = await backend.getUserCampaigns();
      setCampaign(res[0]);
      console.log(res[0], "campaign");
    } catch (error) {
      console.log("Error in getting campaign", error);
    }
  };

  useEffect(() => {
    getCampaign();
  }, [backend]);

  return (
    <>
      <div className="min-h-screen p-4 ">
        <div className="  bg-[#5542F6] hidden sm:block rounded-xl h-24 mb-4 m-2"></div>
        <div className="flex items-center justify-between w-full p-2">
          <p className="text-xl font-bold">Campaign</p>
          <div className="sm:hidden">
            <Link
              to="/campaign-setup"
              className=" flex items-center justify-center  text-sm border-[#5542F6] bg-[#5542F6] gap-2 px-4 py-1 border  text-white rounded capitalize"
            >
              <IoIosAdd className="text-center " size={20} />
              New campaign
            </Link>
          </div>
          <div className="hidden sm:block">
            <select
              name="Filter"
              id="filter"
              className=" flex items-center justify-center outline-none  gap-2 px-4 py-1 border border-gray-500 rounded-md capitalize"
            >
              <IoIosArrowDown className="text-center " size={12} />
              <option value="filter">Filter</option>
              <option value="new">New</option>
              <option value="old">Old</option>
            </select>
          </div>
        </div>

        <div className="grid  mobile:grid-col-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4  ">
          <Link to="/campaign-setup" className="w-full   mb-4   ">
            <NewCampaignCard />
          </Link>
          {campaign?.map((campaign, index) => (
            <div key={index} className="w-full  p-2 ">
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
              >
                <CampaignCard campaign={campaign} />
              </motion.div>
            </div>
          ))}
        </div>
        {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4  ">
          {Array(10)
            .fill(0)
            .map((_, index) => (
              <div key={index} className="w-full  p-2">
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1 }}
                >
                  <CampaignCard />
                </motion.div>
              </div>
            ))}
        </div> */}
      </div>
    </>
  );
};

const NewCampaignCard = () => {
  return (
    <motion.div
      initial={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.9 }}
      duration={2}
      className="hidden sm:block h-full"
    >
      <div className=" m-2 mb-2 flex flex-col items-center justify-center rounded-lg h-full bg-[#dad6f797]  text-center">
        <div className=" w-12 h-12 rounded-md bg-white flex items-center justify-center mx-auto mb-4">
          <TfiPlus className="text-[#564BF1] w-5 h-5 font-semibold" />
        </div>
        <h2 className="text-lg font-semibold text-[#5542F6] mb-2">
          New campaign
        </h2>
        <p className="text-[#5542F6] text-xs px-4">
          Create a campaign to distribute your NFTs via claim links
        </p>
      </div>
    </motion.div>
  );
};

const CampaignCard = ({ campaign }) => {
  return (
    <>
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
                <h2 className="text-lg font-semibold">Test campaign</h2>
                <p className="text-sm text-gray-500">December 5, 13:54</p>
              </div>
            </div>
            <IoSettingsOutline size={24} className="text-gray-400  " />
          </div>
        </div>
        <div className="grid grid-cols-2 ">
          <div className="flex flex-col  border-l-0 py-2 border-b-0 border  border-gray-300 items-start">
            <span className="text-sm text-gray-500">Token</span>
            <span className="font-medium">ERC1155</span>
          </div>
          <div className="flex justify-between border-b-0 border p-2  border-r-0   border-gray-300 ">
            <div className="flex flex-col items-start">
              <span className="text-sm text-gray-500">Claimed</span>
              <span className="font-medium">100/100</span>
            </div>
            <div className="w-12 h-12 rounded-full bg-white border-4 border-r-gray-200 border-t-gray-200 border-[#5542F6] flex items-center justify-center"></div>
          </div>
          <div className="flex flex-col items-start border-l-0 py-2 border-b-0 border  border-gray-300">
            <span className="text-sm text-gray-500">Contract</span>
            <span className="font-medium text-[#5542F6]">0xf8c...992h4</span>
          </div>
          <div className="flex flex-col items-start border-b-0 border p-2  border-r-0   border-gray-300">
            <span className="text-sm text-gray-500">Network</span>
            <span className="font-medium">Internet Computer</span>
          </div>
          <div className="flex flex-col items-start border-l-0 py-2 border-b-0 border  border-gray-300">
            <span className="text-sm text-gray-500">Token standard</span>
            <span className="font-medium">ERC1155</span>
          </div>
          <div className="flex flex-col items-start border-b-0 border p-2  border-r-0   border-gray-300">
            <span className="text-sm text-gray-500">Links</span>
            <span className="font-medium">100</span>
          </div>
          <div className="flex flex-col items-start border-l-0 py-2 border-b-0 border  border-gray-300">
            <span className="text-sm text-gray-500">Sponsorship</span>
            <span className="font-medium">Disable</span>
          </div>
          <div className="flex flex-col items-start border-b-0 border p-2  border-r-0   border-gray-300">
            <span className="text-sm text-gray-500">Claim pattern</span>
            <span className="font-medium">Transfer</span>
          </div>
        </div>
      </div>
      <div className="max-w-sm mx-auto sm:block hidden bg-white  cursor-pointer   rounded-lg overflow-hidden">
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
        </div>
        <div className="px-6 py-4">
          <div className="font-semibold text-lg mb-2">{campaign?.title}</div>
          <p className="text-gray-500 text-xs">April 5, 13:54</p>
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
              <span className="font-semibold">10</span>
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
      </div>
    </>
  );
};

export default DashboardContainer;
