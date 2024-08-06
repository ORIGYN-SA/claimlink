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
  const [collections, setCollections] = useState();

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

        const res = data[0].filter((data) => id == data[0]?.toText());

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
      let idd = Principal.fromText(id);
      const res = await backend.getTokens(idd);

      console.log(res);
      getNft(res);
    } catch (error) {
      console.log("Error getting nfts ", error);
    }
  };

  useEffect(() => {
    getTokensNft();
  }, [backend]);

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
                <h2 className="text-md font-bold  black">Test collection</h2>
              </div>
              <div className="border bg-[#EBEAED] mt-4 w-full"></div>
              <div className=" w-full">
                <div className="flex w-full justify-start relative ">
                  <div className="w-1/2 p-2 flex justify-start ">
                    <div className="flex flex-col justify-start">
                      <p className="gray text-xs">Collection symbol</p>
                      <p className="black font-semibold text-sm">TST </p>
                    </div>
                  </div>
                  <div className="w-1/2  p-2 flex flex-col justify-start relative">
                    <div className="absolute left-0 top-0 bottom-0 w-px bg-[#EBEAED]"></div>
                    <div className="flex flex-col justify-start pl-4">
                      <p className="gray text-xs">Token address</p>
                      <div className="flex items-center gap-2 font-medium text-lg">
                        {" "}
                        <p className="text-[#564BF1] font-semibold text-sm">
                          0xf8c...992h4
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
                      <p className="font-semibold text-sm black">
                        ICRC-7 Token{" "}
                      </p>
                    </div>
                  </div>
                  <div className="w-1/2 p-2 flex flex-col justify-start relative">
                    <div className="absolute left-0 top-0 bottom-0 w-px bg-[#EBEAED]"></div>
                    <div className="flex flex-col justify-start pl-4">
                      <p className="gray text-xs">Token standart</p>
                      <p className="font-semibold text-sm black">ICRC-7</p>
                    </div>
                  </div>
                </div>
                <div className="border bg-[#EBEAED]  w-full"></div>
                <div className="flex w-full justify-start relative">
                  <div className="w-1/2 p-2 flex justify-start">
                    <div className="flex flex-col justify-start">
                      <p className="gray text-xs">Date of create</p>
                      <p className=" font-semibold text-sm black">
                        Dec. 11, 2024 13:54{" "}
                      </p>
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
            <div>
              <h2 className="text-xl font-semibold">My NFTs </h2>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <motion.div
                initial={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.9 }}
                className="bg-[#E9E8FC] px-4 py-8 mt-8 rounded-xl flex flex-col items-center justify-center cursor-pointer"
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

              {nft?.map((nft, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1 }}
                  className="bg-white px-4 py-4 mt-8 rounded-xl   cursor-pointer"
                >
                  <img
                    width="80px"
                    height="80px"
                    src="https://images.pexels.com/photos/3621234/pexels-photo-3621234.jpeg?auto=compress&cs=tinysrgb&w=600"
                    alt="Dispenser"
                  />
                  <h2 className="text-xl black  font-bold  mt-5 ">
                    {nft[2]?.fungible?.name}
                  </h2>
                  <p className="text-xs gray mt-1">April 5, 13:34</p>
                  <div className="border border-gray-200 my-4 w-full"></div>
                  <div className=" w-full">
                    <div className="flex justify-between">
                      <p className="text-xs gray ">Address</p>
                      <p className="text-[#564BF1] text-xs font-semibold line-clamp-1 w-24">
                        {nft[1]}
                      </p>
                    </div>
                    <div className="flex justify-between mt-2">
                      <p className="text-xs gray">Copies</p>
                      <p className="text-xs font-semibold">10</p>
                    </div>
                    <div className="flex justify-between mt-2">
                      <p className="text-xs gray		">ID </p>
                      <p className="text-xs font-semibold"> {nft[0]}</p>
                    </div>
                    <div className="flex justify-between mt-2">
                      <p className="text-xs gray		">Description </p>
                      <p className="text-xs font-semibold"> -</p>
                    </div>
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
                          title="Transfer NFT"
                        />
                      </div>
                    </>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
          <div className="w-1/3 bg-white p-6">
            <h2 className="font-bold text-xl">Test collection</h2>
            <div className="mt-4 w-full">
              <div className="flex justify-between">
                <p className="gray text-sm">Collection symbol</p>
                <p className="black font-semibold text-sm">TST</p>
              </div>
              <div className="flex justify-between mt-2">
                <p className="gray text-sm">Token address</p>
                <div className="flex items-center gap-2">
                  {" "}
                  <p className=" blue font-semibold text-sm">0xf8c...992h4</p>
                  <BsCopy className="w-3 h-3 text-[#564BF1]" />
                </div>{" "}
              </div>
              <div className="flex justify-between mt-2">
                <p className="gray text-sm">Token type</p>
                <p className="black font-semibold text-sm">ICRC-7 Token</p>
              </div>
              <div className="flex justify-between mt-2">
                <p className="gray text-sm">Token standart</p>
                <p className="black font-semibold text-sm">ICRC-7</p>
              </div>
            </div>
            <div className="border border-gray-200 my-4"></div>
            <div className="mt-2 w-full">
              <div className="flex justify-between mt-2">
                <p className="gray text-sm">Date of create</p>
                <p className="black font-semibold text-sm">
                  April 11, 2024 13:54
                </p>
              </div>
              <div className="flex justify-between mt-2">
                <p className="gray text-sm">All token copies</p>
                <p className="black font-semibold text-sm">0</p>
              </div>
            </div>
            <div className="border border-gray-200 my-4"></div>

            <button
              onClick={addcompaign}
              className="px-6 flex gap-2 items-center justify-center w-full py-3 mt-6 bg-[#5542F6] text-white rounded-sm text-sm"
            >
              <GoLink />
              Create claim links
            </button>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default AddTokenHome;
