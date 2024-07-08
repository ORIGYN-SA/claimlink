import React from "react";
import DataCard from "../../common/DataCard";
import Summary from "./Summary";

const TestCampaign = () => {
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
        <DataCard />
      </div>
      <Summary />
    </div>
  );
};

export default TestCampaign;
