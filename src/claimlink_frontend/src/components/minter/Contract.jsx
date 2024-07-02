import React, { useState } from "react";
import StepperComponent from "../../common/StepperComponent";
import MainButton from "../../common/Buttons";
import SelectContractType from "./SelectContractType";
import CollectionSetup from "./CollectionSetup";

const steps = [
  { id: 1, name: "Select contract type" },
  { id: 2, name: "Contract setup" },
];

const StepContent = ({ currentStep, handleNext, handleBack }) => {
  switch (currentStep) {
    case 1:
      return <SelectContractType handleNext={handleNext} />;
    case 2:
      return (
        <CollectionSetup handleNext={handleNext} handleBack={handleBack} />
      );
    default:
      return null;
  }
};

const Contract = () => {
  const [currentStep, setCurrentStep] = useState(1);

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  return (
    <div>
      <StepperComponent
        steps={steps}
        currentStep={currentStep}
        completedColor="green-500"
        activeColor="blue-500"
        defaultColor="gray-300"
      />
      <StepContent
        currentStep={currentStep}
        handleNext={handleNext}
        handleBack={handleBack}
      />
    </div>
  );
};

export default Contract;
