import React, { useState, useEffect } from "react";
import DataCard from "../../common/DataCard";
import Summary from "./Summary";
import { useParams } from "react-router-dom";
import { SiBackendless } from "react-icons/si";
import { useAuth } from "../../connect/useClient";
import { motion } from "framer-motion";

const TestCampaign = () => {
  const campaignId = useParams();
  const { backend } = useAuth();
  const [details, setDetails] = useState();

  const campaignDetails = async () => {
    try {
      const res = await backend.getCampaignDetails(campaignId.campaignId);
      setDetails(res[0]);
      console.log(res, "res");
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    campaignDetails();
  }, [backend]);
  console.log(details, "Details");

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
    <div className="flex justify-between">
      <div className="p-6 md:w-[70%] w-full">
        <div className="flex w-[85%] m-4 text-gray-500 items-center justify-between ">
          <p>#</p>
          <p>Batch Id</p>
          <p className="pl-12">created at</p>
          <p className="pl-16">Links</p>
          <p></p>
        </div>
        <DataCard campaignDetails={details} />
      </div>
      <motion.div
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
        className="bg-white border-l hidden sm:block border-gray-300 p-6 w-80"
      >
        <h2 className="text-xl font-semibold mb-4">{details?.title}</h2>
        <p className="text-gray-500 mb-6">Check and confirm details</p>

        <div className="mb-4 flex justify-between">
          <h3 className="text-gray-500">Created by</h3>
          <p className="font-semibold truncate w-36">
            {details?.createdBy?.toText()}
          </p>
        </div>

        <div className="mb-4 flex justify-between">
          <h3 className="text-gray-500">status</h3>
          <p className="text-[#5542F6] font-semibold">Active</p>
        </div>

        <div className="bg-gray-400 border border-gray-100"></div>

        <div className="my-4 flex justify-between">
          <h3 className="text-gray-500">Token address</h3>
          <p className="font-semibold">{parseInt(details?.depositIndices)}</p>
        </div>
        <div className="my-4 flex justify-between">
          <h3 className="text-gray-500">campaign contract</h3>
          <p className="font-semibold">{parseInt(details?.depositIndices)}</p>
        </div>

        <div className="bg-gray-400 border border-gray-100"></div>

        <div className="my-4 flex justify-between">
          <h3 className="text-gray-500">Claim pattern</h3>
          <p className="font-semibold">{details?.claimPattern}</p>
        </div>

        <div className="bg-gray-400 border border-gray-100"></div>

        <div className="my-4 flex justify-between">
          <h3 className="text-gray-500">Network</h3>
          <p className="font-semibold">Internet computer</p>
        </div>

        <div className="mb-4 flex justify-between">
          <h3 className="text-gray-500">Token standard</h3>
          <p className="font-semibold">EXT</p>
        </div>

        <div className="my-4 flex justify-between">
          <h3 className="text-gray-500">Link amounts</h3>
          <p className="font-semibold">1</p>
        </div>
        <div className="my-4 flex justify-between">
          <h3 className="text-gray-500">Sponsorship</h3>
          <p className="font-semibold">Disabled</p>
        </div>
      </motion.div>
    </div>
  );
};

export default TestCampaign;
