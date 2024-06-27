import React from "react";
import DataCard from "../../common/DataCard";
import Summary from "./Summary";

const TestCampaign = () => {
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
