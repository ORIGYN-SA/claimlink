import { motion } from "framer-motion";
import React, { useMemo, useState, useEffect } from "react";
import { TbInfoHexagon } from "react-icons/tb";
import { TfiPlus } from "react-icons/tfi";
import StyledDropzone from "../../common/StyledDropzone";
import Toggle from "react-toggle";
import { GoDownload, GoLink, GoPlus } from "react-icons/go";
import { BsCopy, BsQrCode } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import CommonModal from "../../common/CommonModel";
import { IoSettingsOutline } from "react-icons/io5";
import { useParams } from "react-router-dom";
import { useAuth } from "../../connect/useClient";
import { Principal } from "@dfinity/principal";
import DescriptionComponent from "../../common/DescriptionModel";
import { RxCross2 } from "react-icons/rx";

const AddTokenHome = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fordata, setFormdata] = useState({
    title: "",
    contract: "",
    collection: "",
  });
  const { id } = useParams();
  const [nft, getNft] = useState();
  const [nonFungibleNft, getNonFungibleNft] = useState();
  const [collections, setCollections] = useState();
  const [filter, setFilter] = useState("non-fungible");
  const [loader, setLoader] = useState(true);
  const [descriptionModel, setDescriptionModel] = useState();
  const [ids, setIds] = useState(false);

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

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await backend?.getUserCollectionDetails();

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

  const getTokensNft = async () => {
    try {
      setLoader(true);
      let idd = Principal.fromText(id);
      const res = await backend.getStoredTokens(idd);

      console.log(res);
      getNft(res[0]);
    } catch (error) {
      console.log("Error getting nfts ", error);
    } finally {
      setLoader(false);
    }
  };

  const getNonfungibleTokensNft = async () => {
    try {
      setLoader(true);
      let idd = Principal.fromText(id);
      console.log("HELLO FROM THE NON  FUNGIBLE ");
      const res = await backend.getNonFungibleTokens(idd);

      console.log(res);
      getNft(res);
    } catch (error) {
      console.log("Error getting nfts ", error);
    } finally {
      setLoader(false);
      setIds(true);
    }
  };

  const handleDes = () => {
    setDescriptionModel(!descriptionModel);
  };
  function formatTimestamp(timestamp) {
    // Convert nanoseconds to milliseconds by dividing by 1,000,000
    const milliseconds = Number(timestamp / 1000000n);

    // Create a new Date object with the milliseconds
    const date = new Date(milliseconds);

    // Extract the components of the date
    const month = date.toLocaleString("en-US", { month: "long" });
    const day = date.getDate();
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    // Format the date as "Month Day, Year Hour:Minute"
    return `${month} ${day}, ${year} ${hours}:${minutes}`;
  }

  useEffect(() => {
    if (filter == "stored") {
      getTokensNft();
    } else {
      getNonfungibleTokensNft();
    }
  }, [backend, filter]);

  console.log(filter);

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
                        <h2 className="text-md font-bold  black">TST</h2>
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
                      {/* <p className="black font-medium text-lg">10</p> */}
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
                      <p className="gray text-xs">All token copies</p>
                      <p className="font-semibold text-sm black">0</p>
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={addcompaign}
                className="px-6 flex gap-2 items-center justify-center w-full py-3 mt-4 bg-[#5542F6] text-white rounded-sm text-sm"
              >
                <GoLink />
                Create claim links
              </button>
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
          <div className="bg-[#EBEAED] py-10 text-center mt-6 rounded-sm">
            <h4 className="text-[#84818A] text-base font-medium">
              You have no tokens yet
            </h4>
            <p className="text-[#84818A] text-xs mt-1">
              Press Add token to create one
            </p>
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
              <select
                name="Filter"
                id="filter"
                className="border border-[#564BF1] px-2 py-1 text-[#564BF1] rounded-md outline-none text-sm"
                onChange={(e) => {
                  const selectedValue = e.target.value;
                  if (selectedValue == "stored") {
                    setFilter("stored");
                  } else if (selectedValue == "non-fungible") {
                    setFilter("non-fungible");
                  }
                }}
              >
                <option value="non-fungible">Minted</option>
                <option value="stored">Stored</option>
              </select>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <motion.div
                initial={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.9 }}
                className="bg-[#E9E8FC] px-4 py-8 mt-8 rounded-xl flex flex-col h-[364px] items-center justify-center cursor-pointer"
                onClick={addToken}
              >
                <div className="bg-white p-2 m-2 rounded-md">
                  <TfiPlus className="text-[#564BF1] w-5 h-5 font-semibold" />
                </div>
                <h2 className="blue text-xl  font-bold mt-3">Add token</h2>
                <p className="blue text-xs text-center mt-2">
                  Click here to add a new tocken to this collection
                </p>
              </motion.div>

              {loader ? (
                [1, 2].map((index) => (
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
              ) : (
                <>
                  {nft?.map((nft, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 1 }}
                      className="bg-white px-4 py-4 mt-8 rounded-xl   cursor-pointer"
                    >
                      {filter == "non-fungible" ? (
                        <img
                          width="80px"
                          height="80px"
                          src={nft[2]?.nonfungible?.thumbnail}
                          alt="Dispenser"
                          className="w-16  h-16"
                        />
                      ) : (
                        <img
                          width="80px"
                          height="80px"
                          src={nft[1]?.nonfungible?.thumbnail}
                          alt="Dispenser"
                          className="w-16  h-16"
                        />
                      )}
                      {filter == "non-fungible" ? (
                        <h2 className="text-xl black  font-bold  mt-5 ">
                          {nft[2]?.nonfungible?.name}
                        </h2>
                      ) : (
                        <h2 className="text-xl black  font-bold  mt-5 ">
                          {nft[1]?.nonfungible?.name}
                        </h2>
                      )}
                      <p className="text-xs gray mt-1">April 5, 13:34</p>
                      <div className="border border-gray-200 my-4 w-full"></div>
                      <div className=" w-full">
                        {filter == "non-fungible" && (
                          <div className="flex justify-between">
                            <p className="text-xs gray ">Address</p>

                            <p className="text-[#564BF1] text-xs font-semibold line-clamp-1 w-24">
                              {typeof nft[1] === "object" ? "" : nft[1]}{" "}
                            </p>
                          </div>
                        )}
                        <div className="flex justify-between mt-2">
                          <p className="text-xs gray">Copies</p>
                          <p className="text-xs font-semibold">1</p>
                        </div>
                        <div className="flex justify-between mt-2">
                          <p className="text-xs gray		">ID </p>
                          <p className="text-xs font-semibold"> {nft[0]}</p>
                        </div>
                        {filter == "non-fungible" && (
                          <div className="flex justify-between mt-2">
                            <p className="text-xs gray		">Description </p>
                            <p
                              className="text-xs font-semibold text-[#564BF1] underline"
                              onClick={handleDes}
                            >
                              view
                            </p>
                            {descriptionModel && (
                              <>
                                <div
                                  className="fixed inset-0 bg-[#7979792e]   z-40"
                                  onClick={handleDes}
                                ></div>
                                <div className="fixed inset-0  items-center justify-center bg z-50">
                                  <div className="h-screen w-screen top-0 bottom-0 left-0 right-0 flex items-center justify-center bg-transparent ">
                                    <motion.div
                                      initial={{ scale: 0, opacity: 0 }}
                                      animate={{
                                        scale: 1,
                                        opacity: 1,
                                        transition: {
                                          ease: "easeInOut",
                                          duration: 0.4,
                                        },
                                      }}
                                      className="filter-card px-2 py-2 bg-white  rounded-xl w-[400px] h-[260px]"
                                    >
                                      <div className="flex justify-between items-center">
                                        <h1 className="text-2xl px-6 font-medium">
                                          Description
                                        </h1>
                                        <button
                                          className=" p-2 rounded-md bg-[#564BF1] hover:bg-[#4039c8]"
                                          onClick={handleDes}
                                        >
                                          <RxCross2 className="text-white w-5 h-5" />
                                        </button>
                                      </div>
                                      <p className="text-gray-500 px-6 text-sm mt-2">
                                        Lorem Ipsum is simply dummy text of the
                                        printing and typesetting industry. Lorem
                                        Ipsum has been the industry's standard
                                        dummy text ever since the 1500s, when an
                                        unknown printer took a galley of type
                                        and scrambled it to make a type specimen
                                        book.
                                      </p>
                                      <div className="flex justify-end mt-4"></div>
                                    </motion.div>
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="border border-gray-200 my-4"></div>
                      <button
                        onClick={toggleModal}
                        className="px-2 flex gap-2  items-center justify-center w-full py-3  bg-[#5442f621] text-[#564BF1] rounded-sm text-sm"
                      >
                        <GoLink />
                        Create claim links
                      </button>
                      {isModalOpen && (
                        <>
                          <div
                            className="fixed inset-0 bg-[#7979792e]   z-40"
                            onClick={toggleModal}
                          ></div>
                          <div className="fixed inset-0 flex  items-center justify-center z-50">
                            <CommonModal
                              toggleModal={toggleModal}
                              canisterid={id}
                              maxquntity={10}
                              nftid={nft[0]}
                              title="Transfer NFT"
                            />
                          </div>
                        </>
                      )}
                    </motion.div>
                  ))}
                </>
              )}
            </div>
          </div>
          <div className="w-1/3 h- bg-white p-6">
            {collections ? (
              <h2 className="font-bold text-xl">{collections[0][2]}</h2>
            ) : (
              <h2 className="font-bold text-xl">test collection</h2>
            )}
            <div className="mt-4 w-full">
              <div className="flex justify-between">
                <p className="gray text-sm">Collection symbol</p>
                {collections ? (
                  <p className="black font-semibold text-sm">
                    {collections[0][3]}
                  </p>
                ) : (
                  <p className="black font-semibold text-sm">TST</p>
                )}
              </div>
              <div className="flex justify-between mt-2">
                <p className="gray text-sm">Token address</p>
                <div className="flex items-center gap-2">
                  {" "}
                  <p className=" blue font-semibold text-sm truncate w-32">
                    {id}
                  </p>
                  <BsCopy className="w-3 h-3 text-[#564BF1]" />
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
                  <p className=" blue font-semibold text-sm">
                    August 1, 2024 12:10
                  </p>
                )}
              </div>
              <div className="flex justify-between mt-2">
                <p className="gray text-sm">All token copies</p>
                <p className="black font-semibold text-sm">1</p>
              </div>
            </div>
            <div className="border border-gray-200 my-4"></div>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default AddTokenHome;
