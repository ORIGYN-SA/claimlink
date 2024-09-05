import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TfiPlus } from "react-icons/tfi";
import { useNavigate } from "react-router-dom";
import { GoPlus } from "react-icons/go";
import { IoSettingsOutline } from "react-icons/io5";
import { useAuth } from "../connect/useClient";
import { useParams } from "react-router-dom";

const Minter = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { identity, backend, principal, isConnected } = useAuth();
  const { id } = useParams();

  const createContract = () => {
    navigate("/minter/new-contract");
  };

  const getBalance = async () => {
    console.log("Hello from get balance");
    try {
      const result = await window.ic.plug.requestBalance();
      console.log(result);
    } catch (e) {
      console.log(e, "Error while getting balance");
    }
  };

  useEffect(() => {
    if (isConnected) {
      getBalance();
    }
  }, [isConnected]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await backend?.getUserCollectionDetails();
        setCollections(data[0]);
        console.log("collection is", data[0]);
      } catch (error) {
        console.error("Data loading error:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    if (backend) {
      loadData();
    }
  }, [backend]);

  return (
    <>
      <div className="p-6 min-h-full">
        <div className="flex justify-between items-center">
          <h2 className="text-lg text-[#2E2C34] font-bold">My NFT contracts</h2>
          {window.innerWidth < 640 ? (
            <button
              onClick={createContract}
              className="flex items-center text-sm gap-2 bg-[#564BF1] px-2 py-1 text-white rounded-md"
            >
              <GoPlus className="text-sm" /> New contract
            </button>
          ) : (
            <select
              name="Filter"
              id="filter"
              className="border border-[#564BF1] px-2 py-1 text-[#564BF1] rounded-md outline-none text-sm"
            >
              <option value="filter">Filter</option>
              <option value="new">New</option>
              <option value="old">Old</option>
            </select>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mt-5">
          <motion.div
            initial={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            className="bg-[#E9E8FC] px-4 py-4 rounded-xl flex flex-col items-center justify-center cursor-pointer"
            onClick={createContract}
          >
            <div className="bg-white p-2 m-2 rounded-md">
              <TfiPlus className="text-[#564BF1] w-5 h-5 font-semibold" />
            </div>
            <h2 className="text-[#564BF1] text-lg  font-bold mt-3 text-center">
              Deploy new contract
            </h2>
            <p className="text-[#564BF1] text-xs text-center mt-2">
              Mint a new token.
            </p>
          </motion.div>
          {loading ? (
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((index) => (
              <div
                className="bg-white px-4 py-4 rounded-xl flex flex-col cursor-pointer animate-pulse"
                key={index}
              >
                {/* Skeleton for loading state */}
                <div className="flex justify-start space-x-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-md" />
                  <div className="w-12 h-12 bg-gray-200 rounded-md" />
                  <div className="w-12 h-12 bg-gray-200 rounded-md" />
                </div>
                <h2 className="text-lg font-semibold text-[#2E2C34] mt-3 w-20 h-8 bg-gray-200"></h2>
                <p className="w-20 h-4 rounded-sm bg-gray-200 mt-2"></p>
                <div className="border border-gray-300 my-4 w-full"></div>
                <div className="mt-2 w-full">
                  <div className="flex justify-between">
                    <p className="w-20 h-6 rounded-sm bg-gray-200"></p>
                    <p className="w-20 h-6 rounded-sm bg-gray-200"></p>
                  </div>
                  <div className="flex justify-between mt-2">
                    <p className="w-20 h-6 rounded-sm bg-gray-200"></p>
                    <p className="w-20 h-6 rounded-sm bg-gray-200"></p>
                  </div>
                  <div className="flex justify-between mt-2">
                    <p className="w-20 h-6 rounded-sm bg-gray-200"></p>
                    <p className="w-20 h-6 rounded-sm bg-gray-200"></p>
                  </div>
                </div>
              </div>
            ))
          ) : collections?.length > 0 ? (
            collections?.map((data, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
                className="bg-white px-4 py-4 rounded-xl flex flex-col cursor-pointer"
                onClick={() => {
                  navigate(`/minter/${data[1]?.toText()}/token-home`);
                }}
              >
                <div className="flex justify-start space-x-4">
                  <img
                    src={data[4]}
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
                <h2 className="text-lg font-semibold text-[#2E2C34] mt-3">
                  {data[2]}
                </h2>
                <div className="border border-gray-300 my-4 w-full"></div>
                <div className="mt-2 w-full">
                  <div className="flex justify-between">
                    <p className="text-xs text-[#84818A]">Address</p>
                    <p className="text-[#564BF1] text-xs line-clamp-1 w-24 font-semibold">
                      {data[1]?.toText()}
                    </p>
                  </div>
                  <div className="flex justify-between mt-2">
                    <p className="text-xs text-[#84818A]">All token copies</p>
                    <p className="text-[#2E2C34] text-xs font-semibold">10</p>
                  </div>
                  <div className="flex justify-between mt-2">
                    <p className="text-xs text-[#84818A]">Token standard</p>
                    <p className="text-[#2E2C34] text-xs font-semibold">EXT</p>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="h-64 w-56 px-4 py-4 text-xl text-center my-auto bg-slate-200 rounded-xl flex flex-col items-center justify-center text-violet-500 cursor-pointer"
            >
              No collection found
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
};

export default Minter;
