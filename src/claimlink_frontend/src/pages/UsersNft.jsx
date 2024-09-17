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
import { IoIosArrowDown } from "react-icons/io";
const UsersNft = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { identity, backend, principal } = useAuth();
  const { id } = useParams();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await backend.getUserTokensFromAllCollections();
        setCollections(res);
        console.log(res, "user nfts");
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
  const handleOpen = () => {
    setOpen(!open);
  };

  return (
    <>
      <div className=" p-6 min-h-full">
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
                    <div className="mt-2 w-full">
                      <div className="flex justify-between mt-2">
                        <p className=" animate-pulse  w-32 h-6  rounded-sm bg-gray-200"></p>
                        <p className=" animate-pulse  w-10 h-6  rounded-sm bg-gray-200"></p>
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
                  >
                    {!open && (
                      <div
                        className="flex justify-between items-center"
                        onClick={() => {
                          navigate(`/user-nft/${data[0].toText()}`);
                        }}
                      >
                        <button className="text-sm  font-semibold text-[#837f8e]  ">
                          {data[1]}
                        </button>
                        <div className="flex items-center gap-2">
                          <h1 className="border border-[#837f8e] border-2 text-[#837f8e] rounded-full size-5 text-xs items-center flex justify-center">
                            {data[2].length}
                          </h1>
                        </div>
                      </div>
                    )}

                    {open && (
                      <>
                        <div className="flex justify-start  space-x-4">
                          <img
                            src={data[2]?.nonfungible?.asset}
                            alt="Campaign"
                            className="w-full h-64 object-cover rounded-md"
                            style={{
                              border: "2px solid white",
                              zIndex: 3,
                            }}
                          />
                        </div>
                        <div className="flex justify-between">
                          <h2 className="text-lg  font-semibold text-[#2E2C34] my-3 ">
                            {data[2]?.nonfungible?.name}
                          </h2>

                          <h2 className="text-lg  font-semibold text-[#2E2C34] my-3 ">
                            #{data[1]}
                          </h2>
                        </div>
                        <h2 className="text-sm  font-semibold text-[#837f8e] mb-3 ">
                          {data[0].toText()}
                        </h2>
                        <button className="px-2 flex gap-2  items-center justify-center w-full py-3  bg-[#5442f621] text-[#564BF1] rounded-sm text-sm">
                          <GoLink />
                          View on Explorer
                        </button>
                      </>
                    )}
                    {/* <p className="text-xs text-[#84818A] mt-1 ">
                        {formatTimestamp(data[0])}
                      </p> */}
                  </motion.div>
                ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default UsersNft;
