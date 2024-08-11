import React, { useState } from "react";
import StepperComponent from "../../common/StepperComponent";
import CampaignSetup from "./CampaignSetup";
import ClaimPattern from "./ClaimPattern";
import DistributionPage from "./DistributionPage";
import Launch from "./Launch";

const steps = [
  { id: 1, name: "Campaign setup" },
  { id: 2, name: "Claim pattern" },
  { id: 3, name: "Distribution" },
  { id: 4, name: "Launch" },
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
        <CampaignSetup
          handleNext={handleNext}
          setFormData={setFormData}
          formData={formData}
        />
      );
    case 2:
      return (
        <ClaimPattern
          handleNext={handleNext}
          handleBack={handleBack}
          setFormData={setFormData}
          formData={formData}
        />
      );
    case 3:
      return (
        <DistributionPage
          handleNext={handleNext}
          handleBack={handleBack}
          setFormData={setFormData}
          formData={formData}
        />
      );
    case 4:
      return (
        <Launch
          handleNext={handleNext}
          handleBack={handleBack}
          setFormData={setFormData}
          formData={formData}
        />
      );
    default:
      return null;
  }
};

const ClaimForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    tokenType: "",
    collection: "",
    claimPattern: "transfer",
    tokenIds: [],
    walletOption: "",
    displayWallets: [],
    expirationDate: 2024 - 10 - 10,
    walletOptions: {
      internetIdentity: false,
      plugWallet: false,
      other: false,
    },
    icpAmount: 0,
    includeICP: false,
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
        handleNext={handleNext}
        handleBack={handleBack}
        formData={formData}
        setFormData={setFormData}
      />
    </div>
  );
};

export default ClaimForm;
