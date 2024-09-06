import React, { useState } from "react";
import StepperComponent from "../../common/StepperComponent";

import QrSetup from "./QrSetup";
import QRSetForm from "./NewQrSet";
import { useAuth } from "../../connect/useClient";
import { PiSecurityCamera } from "react-icons/pi";

const steps = [
  { id: 1, name: "Qr setup" },
  { id: 2, name: "New Qrset" },
];

const StepContent = ({ currentStep, handleNext, handleBack }) => {
  const { backend } = useAuth();

  const [name, setName] = useState();
  const [quantity, setQuantity] = useState(1);
  const [campaignId, setCampaignId] = useState();
  console.log(name, quantity);

  switch (currentStep) {
    case 1:
      return (
        <QrSetup
          handleNext={handleNext}
          setName={setName}
          setQuantity={setQuantity}
        />
      );
    case 2:
      return (
        <QRSetForm
          handleNext={handleNext}
          handleBack={handleBack}
          setCampaignId={setCampaignId}
          name={name}
          quantity={quantity}
        />
      );

      return null;
  }
};

const QrForm = () => {
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

export default QrForm;
