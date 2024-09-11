import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TfiPlus } from "react-icons/tfi";
import { useNavigate } from "react-router-dom";
import { GoPlus } from "react-icons/go";
import { IoSettingsOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { fetchMinterData } from "../redux/features/minterSlice";
import { useAuth } from "../connect/useClient";
import { Principal } from "@dfinity/principal";
import { GoLink } from "react-icons/go";
import { useParams } from "react-router-dom";
const UsersNft = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { identity, backend, principal } = useAuth();
  const { id } = useParams();

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await backend.getUserTokensFromAllCollections();
        setCollections(res);
        console.log(res);
      } catch (error) {
        console.error("Data loading error:", error);
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
      <div className=" p-6 min-h-full">
        {window.innerWidth < 640 ? (
          <div>
            {" "}
            {
              <>
                {loading
                  ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((index) => (
                      <div
                        className="bg-white px-4 py-4 my-4 rounded-xl flex flex-col cursor-pointer"
                        key={index}
                      >
                        <div className="flex justify-start  space-x-4 animate-pulse">
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
                        <h2 className="text-lg  font-semibold text-[#2E2C34] mt-3 animate-pulse w-20 h-8 bg-gray-200"></h2>
                        <p className=" animate-pulse  w-20 h-4  rounded-sm bg-gray-200 mt-2"></p>
                        <div className="border border-gray-300 my-4 w-full"></div>
                        <div className="mt-2 w-full">
                          <div className="flex justify-between">
                            <p className=" animate-pulse  w-20 h-6  rounded-sm bg-gray-200"></p>
                            <p className=" animate-pulse  w-20 h-6  rounded-sm bg-gray-200"></p>
                          </div>
                          <div className="flex justify-between mt-2">
                            <p className=" animate-pulse  w-20 h-6  rounded-sm bg-gray-200"></p>
                            <p className=" animate-pulse  w-20 h-6  rounded-sm bg-gray-200"></p>
                          </div>
                          <div className="flex justify-between mt-2">
                            <p className=" animate-pulse  w-20 h-6  rounded-sm bg-gray-200"></p>
                            <p className=" animate-pulse  w-20 h-6  rounded-sm bg-gray-200"></p>
                          </div>
                        </div>
                      </div>
                    ))
                  : collections?.map((collection, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1 }}
                        className="bg-white  py-4 mt-6 rounded-xl flex flex-col shadow-md"
                        onClick={() => {
                          navigate(
                            `/minter/${collection[1]?.toText()}/token-home`
                          );
                        }}
                      >
                        <div className="px-4">
                          <div className="flex justify-between items-center ">
                            <div className="flex items-center gap-3">
                              <img
                                width="80px"
                                height="80px"
                                src={collection[4]}
                                alt="Dispenser"
                                className="rounded-lg"
                              />
                              <div className="">
                                <h2 className="md:text-lg text-sm font-semibold text-[#2E2C34]  ">
                                  {collection[2]}
                                </h2>
                                <p className="text-[#84818A] md:text-sm text-xs ">
                                  April 5, 13:34
                                </p>
                              </div>
                            </div>
                            <div>
                              <IoSettingsOutline className="w-6 h-6 text-[#84818A]" />
                            </div>
                          </div>
                          <div className="border bg-[#EBEAED] mt-4 w-full"></div>
                          <div className=" w-full">
                            <div className="flex w-full justify-start relative">
                              <div className="w-1/2 p-2 flex justify-start">
                                <div className="flex flex-col justify-start">
                                  <p className="text-[#84818A] md:text-sm text-xs">
                                    Address
                                  </p>
                                  <p className="text-[#564BF1] font-semibold text-sm">
                                    {collection[1]?.toText()}
                                  </p>
                                </div>
                              </div>
                              <div className="w-1/2 p-2 flex flex-col justify-start relative">
                                <div className="absolute left-0 top-0 bottom-0 w-px bg-[#EBEAED]"></div>
                                <div className="flex flex-col justify-start pl-4">
                                  <p className="text-[#84818A] md:text-sm text-xs">
                                    All token copies
                                  </p>
                                  <p className="text-[#2E2C34] font-semibold text-sm">
                                    1
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="border bg-[#EBEAED]  w-full"></div>
                            <div className="flex flex-wrap  relative">
                              <div className="w-1/2 mt-2 flex justify-start">
                                <div className="flex flex-col justify-start">
                                  <p className="text-[#84818A] md:text-sm text-xs">
                                    Token standart
                                  </p>
                                  <p className="text-[#2E2C34] font-semibold text-sm">
                                    EXT
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
              </>
            }
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center">
              <h2 className="text-lg  font-bold text-[#2E2C34]">My NFT</h2>
              <select
                name="Filter"
                id="filter"
                className="border border-[#564BF1] px-2 py-1 text-[#564BF1] rounded-md outline-none text-sm"
              >
                <option value="new">New</option>
                <option value="old">Old</option>
              </select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-4 gap-5 mt-5">
              {loading
                ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((index) => (
                    <div
                      className="bg-white px-4 py-4 rounded-xl flex flex-col cursor-pointer"
                      key={index}
                    >
                      <div className="flex justify-start  space-x-4 animate-pulse">
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
                      <h2 className="text-lg  font-semibold text-[#2E2C34] mt-3 animate-pulse w-20 h-8 bg-gray-200"></h2>
                      <p className=" animate-pulse  w-20 h-4  rounded-sm bg-gray-200 mt-2"></p>
                      <div className="border border-gray-300 my-4 w-full"></div>
                      <div className="mt-2 w-full">
                        <div className="flex justify-between">
                          <p className=" animate-pulse  w-20 h-6  rounded-sm bg-gray-200"></p>
                          <p className=" animate-pulse  w-20 h-6  rounded-sm bg-gray-200"></p>
                        </div>
                        <div className="flex justify-between mt-2">
                          <p className=" animate-pulse  w-20 h-6  rounded-sm bg-gray-200"></p>
                          <p className=" animate-pulse  w-20 h-6  rounded-sm bg-gray-200"></p>
                        </div>
                        <div className="flex justify-between mt-2">
                          <p className=" animate-pulse  w-20 h-6  rounded-sm bg-gray-200"></p>
                          <p className=" animate-pulse  w-20 h-6  rounded-sm bg-gray-200"></p>
                        </div>
                      </div>
                    </div>
                  ))
                : collections?.map((data, index) => (
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
                      <div className="flex justify-start  space-x-4">
                        <img
                          src={data?.nonfungible?.asset}
                          alt="Campaign"
                          className="w-full h-64 object-cover rounded-md"
                          style={{
                            border: "2px solid white",
                            zIndex: 3,
                          }}
                        />
                      </div>
                      <h2 className="text-lg  font-semibold text-[#2E2C34] my-3 ">
                        {data?.nonfungible?.name}
                      </h2>
                      <button
                        onClick={() => {
                          navigate("/campaign-setup");
                        }}
                        className="px-2 flex gap-2  items-center justify-center w-full py-3  bg-[#5442f621] text-[#564BF1] rounded-sm text-sm"
                      >
                        <GoLink />
                        View on Explorer
                      </button>
                      {/* <p className="text-xs text-[#84818A] mt-1 ">
                        {formatTimestamp(data[0])}
                      </p> */}
                    </motion.div>
                  ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default UsersNft;
