import React from 'react';

interface Step {
  id: string;
  label: string;
  completed: boolean;
  active: boolean;
}

interface StepperProps {
  steps: Step[];
}

export function Stepper({ steps }: StepperProps) {
  return (
    <div className="bg-[#fcfafa] border-[0px_0px_1px] border-[rgba(0,0,0,0.1)] border-solid h-[48px] relative shrink-0 w-full">
      <div className="absolute content-stretch flex items-start left-[8px] top-0">
        {steps.map((step, index) => (
          <div key={step.id} className="content-stretch flex gap-[10px] h-[48px] items-center justify-center relative shrink-0">
            <div className="box-border content-stretch flex gap-[10px] items-center px-[24px] py-0 relative shrink-0">
              <div
                className={`border-2 border-solid relative rounded-[50px] shrink-0 size-[24px] ${
                  step.completed || step.active ? 'border-[#1f9cd4]' : 'border-[#e1e1e1]'
                }`}
              >
                <div className="absolute inset-[12.5%]">
                  <div className="absolute inset-[-5.97%_-6.84%_-5.98%_-6.84%]">
                    <svg
                      className="block max-w-none size-full"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 0 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"
                        fill={step.completed || step.active ? "#1f9cd4" : "#e1e1e1"}
                      />
                    </svg>
                  </div>
                </div>
                <p className="absolute font-['Manrope:ExtraBold',_sans-serif] font-extrabold inset-[7.29%_40.63%_30.21%_40.63%] leading-[20px] text-[10px] text-center text-white">
                  {index + 1}
                </p>
              </div>
              <p
                className={`font-['Manrope:SemiBold',_sans-serif] font-semibold leading-[20px] relative shrink-0 text-[12px] text-nowrap whitespace-pre ${
                  step.completed || step.active
                    ? 'bg-clip-text text-transparent bg-gradient-to-r from-[#1f9cd4] to-[#1d2d45]'
                    : 'text-[#e1e1e1]'
                }`}
              >
                {step.label}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
