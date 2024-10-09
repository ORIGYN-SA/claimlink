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
import ScrollToTop from "../common/ScroolToTop";
const UserNft2 = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { identity, backend, principal } = useAuth();
  const { id } = useParams();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    console.log(id);
    const loadData = async () => {
      try {
        const res = await backend.getUserTokensFromAllCollections();
        const idd = Principal.fromText(id); // Convert id to Principal

        const res1 = await backend.getNonFungibleTokensPaginate(idd, 0, 10);
        console.log(res1, "users nft form the user nft page ");
        const totalPages = parseInt(res1.total_pages);

        // Filter the collections that match the idd
        const matchedCollection = res.find(
          (collection) => collection[0].toText() === idd.toText()
        );

        if (matchedCollection) {
          // Set the value at index 2 of the matched collection to state
          setCollections(res1.data);

          console.log(matchedCollection[2], "Matched user NFT collection");
        } else {
          console.log("No matching collection found for id:", idd.toText());
        }
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
  }, [backend, id]);
  const limitCharacters = (text, charLimit) => {
    if (!text || text.length === 0) {
      return ""; // or return a fallback string like "N/A" if needed
    }
    if (text.length > charLimit) {
      return text.slice(0, charLimit) + "...";
    }
    return text;
  };

  return (
    <>
      <ScrollToTop />
      <div className=" p-6 min-h-full">
        <div>
          <div className="flex justify-between items-center">
            <h2 className="text-lg  font-bold text-[#2E2C34]">
              Collected NFT{" "}
            </h2>
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
                  >
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
                          {limitCharacters(data[2]?.nonfungible?.name, 15)}
                        </h2>

                        <h2 className="text-lg  font-semibold text-[#2E2C34] my-3 ">
                          #{data[0]}
                        </h2>
                      </div>
                      <h2 className="text-sm  font-semibold text-[#837f8e] mb-3 ">
                        {id}
                      </h2>
                      {/* <button className="px-2 flex gap-2  items-center justify-center w-full py-3  bg-[#5442f621] text-[#564BF1] rounded-sm text-sm">
                        <GoLink />
                        View on Explorer
                      </button> */}
                    </>

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

export default UserNft2;
