import { motion } from "framer-motion";
import React, { useMemo, useState, useRef, useEffect } from "react";

import { TfiPlus } from "react-icons/tfi";

import { GoDownload, GoLink, GoPlus } from "react-icons/go";
import { BsCopy, BsQrCode } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

import { useParams } from "react-router-dom";
import { useAuth } from "../../connect/useClient";
import { Principal } from "@dfinity/principal";

import toast from "react-hot-toast";
import NftCards from "../../common/NftCards";
import NftMobileCards from "../../common/NftMobileCards";

const AddTokenHome = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fordata, setFormdata] = useState({
    title: "",
    contract: "",
    collection: "",
  });

  const [copied, setCopied] = useState(false);

  const { id } = useParams();
  const [nft, getNft] = useState();
  const [nonFungibleNft, getNonFungibleNft] = useState();
  const [collections, setCollections] = useState();
  const [filter, setFilter] = useState();
  const [loader, setLoader] = useState(true);
  const [descriptionModel, setDescriptionModel] = useState();
  const [ids, setIds] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const [totalPages, setTotalPages] = useState(1);
  const [nftCount, setNftCount] = useState(0);
  const [storedCount, SetStoredCount] = useState(0);

  const { backend } = useAuth();
  const addToken = () => {
    navigate(`/minter/${id}/token-home/add-token`);
  };
  const addcompaign = () => {
    navigate("/minter/:id/distribution-setup");
  };
  [];
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
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

  // Function to handle copying to the clipboard
  const handleCopy = (text) => {
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          toast.success("Address copied to clipboard!"); // Optional: Alert to confirm the action
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
  useEffect(() => {
    const loadData = async () => {
      try {
        let idd = Principal.fromText(id);
        const data = await backend?.getUserCollectionDetails();
        const data2 = await backend.getStoredTokensPaginate(idd, 0, 5);
        const data3 = await backend.getNonFungibleTokensPaginate(idd, 0, 5);

        SetStoredCount(data2.data.length);
        setNftCount(data3.data.length);

        console.log(data2.data.length, "stored length");
        console.log(data3.data.length, "nft length");

        // Set the initial filter based on counts
        if (data2.data.length > data3.data.length) {
          setFilter("stored");
        } else {
          setFilter("non-fungible");
        }

        const res = data[0].filter((data) => id == data[1]?.toText());
        console.log(res, "collection details");
        setCollections(res);
      } catch (error) {
        console.error("Data loading error:", error);
      }
    };

    if (backend) {
      loadData();
    }
  }, [backend]);

  useEffect(() => {
    const loadNfts = async () => {
      try {
        if (filter === "stored") {
          await getTokensNft(currentPage);
          setLoader(false);
        } else if (filter === "non-fungible") {
          await getNonfungibleTokensNft(currentPage);
          setLoader(false);
        }
      } catch (error) {
        console.error("Error loading NFTs:", error);
      } finally {
      }
    };

    if (backend) {
      setLoader(true); // Start loader before fetching data
      loadNfts();
    }
  }, [backend, filter, currentPage, nftCount, storedCount]);

  const getTokensNft = async (page = 1) => {
    try {
      setLoader(true);
      let idd = Principal.fromText(id);
      const res1 = await backend.getStoredTokensPaginate(idd, page - 1, 5);

      const totalPages = parseInt(res1.total_pages);
      getNft(res1.data);
      setTotalPages(totalPages);
    } catch (error) {
      console.log("Error getting NFTs ", error);
    } finally {
    }
  };

  const getNonfungibleTokensNft = async (page = 1) => {
    try {
      setLoader(true);
      let idd = Principal.fromText(id);
      const res1 = await backend.getNonFungibleTokensPaginate(idd, page - 1, 5);
      const totalPages = parseInt(res1.total_pages);
      getNft(res1.data);
      setTotalPages(totalPages);
    } catch (error) {
      console.log("Error getting NFTs ", error);
    } finally {
    }
  };

  const handlePageChange = (pageNum) => {
    setCurrentPage(pageNum);
  };
  const handleDes = () => {
    setDescriptionModel(!descriptionModel);
  };

  useEffect(() => {
    setCurrentPage(1); // Reset to page 1 when filter changes
  }, [filter]);
  function formatTimestamp(timestamp) {
    const milliseconds = Number(timestamp / 1000000n);

    const date = new Date(milliseconds);

    const month = date.toLocaleString("en-US", { month: "long" });
    const day = date.getDate();
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return `${month} ${day}, ${year} ${hours}:${minutes}`;
  }
  const pageVariants = {
    initial: {
      opacity: 0,
      x: "-100vw",
    },
    in: {
      opacity: 1,
      x: 0,
    },
    out: {
      opacity: 0,
      x: "100vw",
    },
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.8,
  };
  return (
    <>
      {window.innerWidth < 640 ? (
        <div className="p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="bg-white  py-6 mt-6 rounded-xl flex flex-col shadow-md"
          >
            <div className="px-6">
              <div className=" ">
                {collections ? (
                  <h2 className="text-md font-bold  black">
                    {collections[0][2]}
                  </h2>
                ) : (
                  <h2 className="text-md font-bold  black">collections</h2>
                )}
              </div>
              <div className="border bg-[#EBEAED] mt-4 w-full"></div>
              <div className=" w-full">
                <div className="flex w-full justify-start relative ">
                  <div className="w-1/2 p-2 flex justify-start ">
                    <div className="flex flex-col justify-start">
                      <p className="gray text-xs">Collection symbol</p>
                      {collections ? (
                        <h2 className="text-md font-bold  black">
                          {collections[0][3]}
                        </h2>
                      ) : (
                        <h2 className="text-md font-bold animate-pulse w-24 h-6 "></h2>
                      )}
                    </div>
                  </div>
                  <div className="w-1/2  p-2 flex flex-col justify-start relative">
                    <div className="absolute left-0 top-0 bottom-0 w-px bg-[#EBEAED]"></div>
                    <div className="flex flex-col justify-start pl-4">
                      <p className="gray text-xs">Token address</p>
                      <div className="flex items-center gap-2 font-medium text-lg">
                        {" "}
                        <p className="text-[#564BF1] font-semibold text-sm truncate w-28">
                          {id}
                        </p>
                        <BsCopy className="w-3 h-3 text-[#564BF1]" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="border bg-[#EBEAED]  w-full"></div>
                <div className="flex w-full justify-start relative">
                  <div className="w-1/2 p-2 flex justify-start">
                    <div className="flex flex-col justify-start">
                      <p className="gray text-xs">Token type</p>
                      <p className="font-semibold text-sm black">EXT Token </p>
                    </div>
                  </div>
                  <div className="w-1/2 p-2 flex flex-col justify-start relative">
                    <div className="absolute left-0 top-0 bottom-0 w-px bg-[#EBEAED]"></div>
                    <div className="flex flex-col justify-start pl-4">
                      <p className="gray text-xs">Token standart</p>
                      <p className="font-semibold text-sm black">EXT</p>
                    </div>
                  </div>
                </div>
                <div className="border bg-[#EBEAED]  w-full"></div>
                <div className="flex w-full justify-start relative">
                  <div className="w-1/2 p-2 flex justify-start">
                    <div className="flex flex-col justify-start">
                      <p className="gray text-xs">Date of create</p>
                      {collections ? (
                        <p className=" blue font-semibold text-sm">
                          {" "}
                          {formatTimestamp(collections[0][0])}
                        </p>
                      ) : (
                        <p className=" blue font-semibold text-sm">
                          August 1, 2024 12:10
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="w-1/2 p-2 flex flex-col justify-start relative">
                    <div className="absolute left-0 top-0 bottom-0 w-px bg-[#EBEAED]"></div>
                    <div className="flex flex-col justify-start pl-4">
                      {/* <p className="gray text-xs">All token copies</p>
                      <p className="font-semibold text-sm black">0</p> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="flex justify-between items-center mt-10">
            <h2 className="text-xl black  font-bold"> My NFTs</h2>
            <button
              onClick={addToken}
              className="flex items-center text-sm gap-2 bg-[#564BF1] px-2 py-1 text-white rounded-md"
            >
              <GoPlus className="text-sm" /> Add token
            </button>
          </div>
          {loader ? (
            [1, 2, 3, 4, 5].map((index) => (
              <div
                className="bg-white px-4 py-4 mt-4 rounded-xl flex flex-col cursor-pointer"
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
          ) : (
            <>
              {nft?.map((nft, index) => (
                <NftMobileCards nft={nft} filter={filter} />
              ))}
            </>
          )}
          <div className="flex justify-center mt-6">
            {totalPages > 1 && (
              <div className="flex justify-center mt-6 items-center space-x-2">
                {/* Prev button */}
                <button
                  className={`px-3 py-1 rounded ${
                    currentPage === 1
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-gray-200"
                  }`}
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Prev
                </button>

                {/* Page number buttons */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (pageNum) => (
                    <button
                      key={pageNum}
                      className={`mx-1 px-3 py-1 rounded ${
                        currentPage === pageNum
                          ? "bg-[#564BF1] text-white"
                          : "bg-gray-200"
                      }`}
                      onClick={() => handlePageChange(pageNum)}
                    >
                      {pageNum}
                    </button>
                  )
                )}

                {/* Next button */}
                <button
                  className={`px-3 py-1 rounded ${
                    currentPage === totalPages
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-gray-200"
                  }`}
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ scale: 1, opacity: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{}}
          className="flex"
        >
          <div className="p-6 w-2/3">
            <div className="flex justify-between">
              <h2 className="text-xl font-semibold">My NFTs </h2>
              <CustomDropdown filter={filter} setFilter={setFilter} />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <motion.div
                initial={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.9 }}
                className={`bg-[#E9E8FC] px-4 py-8 mt-8 rounded-xl flex flex-col items-center justify-center cursor-pointer ${
                  filter == "stored" ? "h-[300px]" : "h-[345px]"
                }`}
                onClick={addToken}
              >
                <div className="bg-white p-2 m-2 rounded-md">
                  <TfiPlus className="text-[#564BF1] w-5 h-5 font-semibold" />
                </div>
                <h2 className="blue text-xl  font-bold mt-3">Add token</h2>
                <p className="blue text-xs text-center mt-2">
                  Click here to add a new token to this collection
                </p>
              </motion.div>

              {loader ? (
                [1, 2, 3, 4, 5].map((index) => (
                  <div
                    className="bg-white px-4 py-4 rounded-xl flex mt-4 flex-col cursor-pointer"
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
              ) : (
                <>
                  {nft?.map((nft, index) => (
                    <NftCards
                      nft={nft}
                      filter={filter}
                      descriptionModel={descriptionModel}
                      handleDes={handleDes}
                    />
                  ))}
                </>
              )}
            </div>
            <div className="flex justify-center mt-6">
              {totalPages > 1 && (
                <div className="flex justify-center mt-6 items-center space-x-2">
                  {/* Prev button */}
                  <button
                    className={`px-3 py-1 rounded ${
                      currentPage === 1
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-gray-200"
                    }`}
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Prev
                  </button>

                  {/* Page number buttons */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (pageNum) => (
                      <button
                        key={pageNum}
                        className={`mx-1 px-3 py-1 rounded ${
                          currentPage === pageNum
                            ? "bg-[#564BF1] text-white"
                            : "bg-gray-200"
                        }`}
                        onClick={() => handlePageChange(pageNum)}
                      >
                        {pageNum}
                      </button>
                    )
                  )}

                  {/* Next button */}
                  <button
                    className={`px-3 py-1 rounded ${
                      currentPage === totalPages
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-gray-200"
                    }`}
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="w-1/3 h- bg-white p-6">
            {collections ? (
              <h2 className="font-bold text-xl">{collections[0][2]}</h2>
            ) : (
              <p className=" animate-pulse  w-32 h-6  rounded-sm bg-gray-200"></p>
            )}
            <div className="mt-4 w-full">
              <div className="flex justify-between">
                <p className="gray text-sm">Collection symbol</p>
                {collections ? (
                  <p className="black font-semibold text-sm">
                    {collections[0][3]}
                  </p>
                ) : (
                  <p className=" animate-pulse  w-20 h-6  rounded-sm bg-gray-200"></p>
                )}
              </div>
              <div className="flex justify-between mt-2">
                <p className="gray text-sm">Token address</p>
                <div className="flex items-center gap-2">
                  {" "}
                  <p className=" blue font-semibold text-sm truncate w-32">
                    {id}
                  </p>
                  <BsCopy
                    onClick={() => {
                      handleCopy(id);
                    }}
                    className="w-3 h-3 cursor-pointer text-[#564BF1]"
                  />
                </div>{" "}
              </div>
              <div className="flex justify-between mt-2">
                <p className="gray text-sm">Token type</p>
                <p className="black font-semibold text-sm">EXT Token</p>
              </div>
              <div className="flex justify-between mt-2">
                <p className="gray text-sm">Token standart</p>
                <p className="black font-semibold text-sm">EXT</p>
              </div>
            </div>
            <div className="border border-gray-200 my-4"></div>
            <div className="mt-2 w-full">
              <div className="flex justify-between mt-2">
                <p className="gray text-sm">Date of create</p>
                {collections ? (
                  <p className=" blue font-semibold text-sm">
                    {" "}
                    {formatTimestamp(collections[0][0])}
                  </p>
                ) : (
                  <p className=" animate-pulse  w-20 h-6  rounded-sm bg-gray-200"></p>
                )}
              </div>
              <div className="flex justify-between mt-2">
                {/* <p className="gray text-sm">All token copies</p>
                <p className="black font-semibold text-sm">1</p> */}
              </div>
            </div>
            <div className="border border-gray-200 my-4"></div>
          </div>
        </motion.div>
      )}
    </>
  );
};

const CustomDropdown = ({ filter, setFilter }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null); // Create a ref to track the dropdown

  const options = [
    { value: "non-fungible", label: "Minted" },
    { value: "stored", label: "Stored" },
  ];

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (value) => {
    setFilter(value); // Set the filter based on selection
    setIsOpen(false); // Close the dropdown after selection
  };

  // Function to detect clicks outside the dropdown
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false); // Close dropdown if clicked outside
    }
  };

  useEffect(() => {
    // Add event listener for clicks outside the dropdown
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up the event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={dropdownRef} className="relative inline-block text-left">
      {/* Dropdown Button */}
      <button
        onClick={toggleDropdown}
        className="border border-[#564BF1] bg-white px-2 py-1 text-[#564BF1] rounded-md text-sm"
      >
        {filter === "non-fungible" ? "Minted" : "Stored"}
        <span className="ml-1">&#9662;</span> {/* Down arrow icon */}
      </button>

      {/* Dropdown Options */}
      {isOpen && (
        <ul className="absolute z-10 mt-2 w-full bg-white border border-gray-300 rounded-md shadow-lg">
          {options.map((option) => (
            <li
              key={option.value}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
              onClick={() => handleOptionClick(option.value)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AddTokenHome;
