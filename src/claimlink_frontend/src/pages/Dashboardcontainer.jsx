import React from "react";
import { FaPlus } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";

const DashboardContainer = () => {
  return (
    <div className="min-h-screen  ">
      <div className="  bg-[#5542F6]  rounded-xl h-24 mb-4 m-2"></div>
      <div className="flex items-center justify-between w-full p-2">
        <p className="text-xl font-semibold">Campaign</p>
        <button className=" flex items-center justify-center  gap-2 px-4 py-1 border border-gray-500 rounded-md capitalize">
          <IoIosArrowDown className="text-center " size={12} />
          filter
        </button>
      </div>
      <div className="grid mobile:grid-col-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4  ">
        <div className="w-full   mb-4   ">
          <NewCampaignCard />
        </div>
        {Array(3)
          .fill(0)
          .map((_, index) => (
            <div key={index} className="w-full  p-2 ">
              <CampaignCard />
            </div>
          ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4  ">
        {Array(10)
          .fill(0)
          .map((_, index) => (
            <div key={index} className="w-full  p-2">
              <CampaignCard />
            </div>
          ))}
      </div>
    </div>
  );
};

const NewCampaignCard = () => {
  return (
    <div className=" m-2 mb-2 flex flex-col items-center justify-center rounded-lg h-full bg-[#dad6f797] shadow-md text-center">
      <div className=" w-12 h-12 rounded-md bg-white flex items-center justify-center mx-auto mb-4">
        <FaPlus className="text-[#5542F6]" />
      </div>
      <h2 className="text-lg font-semibold text-[#5542F6] mb-2">
        New campaign
      </h2>
      <p className="text-[#5542F6] text-xs px-4">
        Create a campaign to distribute your NFTs via claim links
      </p>
    </div>
  );
};

const CampaignCard = () => {
  return (
    <div className="max-w-sm mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
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
        <div className="font-semibold text-lg mb-2">Test campaign</div>
        <p className="text-gray-500 text-xs">April 5, 13:54</p>
        <hr className="my-4" />
        <div className="text-xs">
          <div className="flex justify-between py-1">
            <span className="text-gray-500">Contract</span>
            <span className="text-blue-500">0xf8c...992h4</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-gray-500">Network</span>
            <span>Internet Computer</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-gray-500">Token standard</span>
            <span>ERC1155</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-gray-500">Links</span>
            <span>10</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-gray-500">Claims</span>
            <span>0</span>
          </div>
          <hr className="my-2" />

          <div className="flex justify-between py-1">
            <span className="text-gray-500">Sponsorship</span>
            <span>Disable</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-gray-500">Claim pattern</span>
            <span>Transfer</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardContainer;
