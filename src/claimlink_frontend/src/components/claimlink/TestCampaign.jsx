import React, { useState, useEffect } from "react";
import DataCard from "../../common/DataCard";
import Summary from "./Summary";
import { useParams } from "react-router-dom";
import { SiBackendless } from "react-icons/si";
import { useAuth } from "../../connect/useClient";

const TestCampaign = () => {
  const campaignId = useParams();
  const { backend } = useAuth();
  const [details, setDetails] = useState();

  const campaignDetails = async () => {
    try {
      const res = await backend.getCampaignDetails(campaignId.campaignId);
      setDetails(res);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    campaignDetails();
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
    <div className="flex justify-between">
      <div className="p-6 md:w-[70%] w-full">
        <DataCard campaignDetails={details} />
      </div>
    </div>
  );
};

export default TestCampaign;
