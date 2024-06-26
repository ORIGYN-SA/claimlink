import React from "react";

const steps = [
  { id: 1, name: "Campaign setup", status: "completed" },
  { id: 2, name: "Claim pattern", status: "current" },
  { id: 3, name: "Distribution", status: "upcoming" },
  { id: 4, name: "Launch", status: "upcoming" },
];

const Stepper = () => {
  return (
    <div className="flex items-center justify-between w-full p-4">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step.status === "completed"
                  ? "bg-green-500 text-white"
                  : step.status === "current"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300 text-gray-500"
              }`}
            >
              {step.status === "completed" ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <span className="font-semibold">{step.id}</span>
              )}
            </div>
            <div className="mt-2 text-xs text-center">
              <span
                className={`${
                  step.status === "completed"
                    ? "text-green-500"
                    : step.status === "current"
                    ? "text-blue-500"
                    : "text-gray-500"
                }`}
              >
                {step.name}
              </span>
            </div>
          </div>
          {index !== steps.length - 1 && (
            <div
              className={`flex-1 border-t-2 mx-2 ${
                step.status === "completed"
                  ? "border-green-500"
                  : step.status === "current"
                  ? "border-blue-500"
                  : "border-gray-300"
              }`}
            ></div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Stepper;
