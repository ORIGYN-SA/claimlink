import React, { useState } from "react";
import StepperComponent from "../../common/StepperComponent";
import DispenserSetup from "./DispenserSetup";
import CreateDispenser from "./CreateDispenser";

const steps = [
  { id: 1, name: "Dispenser Setup" },
  { id: 2, name: "Create Dispenser" },
];

const StepContent = ({
  currentStep,
  handleNext,
  handleBack,
  formData,
  setFormData,
}) => {
  switch (currentStep) {
    case 1:
      return (
        <DispenserSetup
          handleNext={handleNext}
          formData={formData}
          setFormData={setFormData}
        />
      );
    case 2:
      return (
        <CreateDispenser
          handleNext={handleNext}
          handleBack={handleBack}
          formData={formData}
          setFormData={setFormData}
        />
      );
    default:
      return null;
  }
};

const DispenserForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    campaign: "",
    title: "",
    startDate: 0,
    duration: "",
    whitelist: [],
  });

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
        formData={formData}
        setFormData={setFormData}
        handleNext={handleNext}
        handleBack={handleBack}
      />
    </div>
  );
};

export default DispenserForm;
