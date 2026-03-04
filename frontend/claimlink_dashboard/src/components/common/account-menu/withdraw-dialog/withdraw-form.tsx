import { useForm } from "@tanstack/react-form";
import { Principal } from "@dfinity/principal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import icon from "@/assets/icon.svg";
import type { WithdrawFormData } from "./types";

interface WithdrawFormProps {
  currentBalance: number;
  transferFee: number;
  onSubmit: (data: WithdrawFormData) => void;
  onClose: () => void;
  initialData?: WithdrawFormData | null;
}

export function WithdrawForm({
  currentBalance,
  transferFee,
  onSubmit,
  onClose,
  initialData,
}: WithdrawFormProps) {
  const form = useForm({
    defaultValues: {
      amount: initialData?.amount || "",
      recipientAddress: initialData?.recipientAddress || "",
    },
    onSubmit: async ({ value }) => {
      onSubmit(value);
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="flex flex-col"
    >
      {/* Main Content Section */}
      <div className="bg-white px-5 pt-5 pb-10">
        {/* Close Button */}
        <div className="flex justify-end mb-6">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="w-6 h-6 p-0 text-[#69737c] hover:text-[#222526] hover:bg-transparent"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </Button>
        </div>

        {/* Title and Description */}
        <div className="flex flex-col items-center gap-6">
          <div className="text-center">
            <h2 className="text-[#222526] text-2xl font-normal tracking-[1.2px] mb-1">
              Transfer OGY
            </h2>
            <p className="text-[#69737c] text-sm leading-normal">
              You can only send OGY from your available balance.
            </p>
          </div>

          {/* Amount Input */}
          <form.Field
            name="amount"
            validators={{
              onChange: ({ value }) => {
                if (!value || value.trim() === "") {
                  return "Amount is required";
                }

                const numValue = parseFloat(value);

                if (isNaN(numValue)) {
                  return "Please enter a valid number";
                }

                if (numValue <= 0) {
                  return "Amount must be greater than 0";
                }

                // Check if amount is greater than transfer fee
                if (numValue <= transferFee) {
                  return `Amount must be greater than the transaction fee (${transferFee.toFixed(4)} OGY)`;
                }

                // Check if total (amount + fee) doesn't exceed balance
                const total = numValue + transferFee;
                if (total > currentBalance) {
                  const availableToSend = Math.max(0, currentBalance - transferFee);
                  return `Insufficient balance. Maximum you can send is ${availableToSend.toFixed(2)} OGY (balance minus ${transferFee.toFixed(4)} OGY fee)`;
                }

                return undefined;
              },
              onChangeAsyncDebounceMs: 500,
            }}
          >
            {(field) => (
              <div className="w-full">
                <label className="text-[#6f6d66] text-sm font-medium mb-2 flex items-center justify-between">
                  <span>Amount</span>
                  <button
                    type="button"
                    onClick={() => {
                      const maxAmount = Math.max(0, currentBalance - transferFee);
                      field.handleChange(maxAmount.toFixed(8));
                    }}
                    disabled={currentBalance <= transferFee}
                    className="text-[#222526] text-xs font-semibold px-3 py-1 rounded-full border border-[#e1e1e1] hover:bg-[#fcfafa] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    MAX
                  </button>
                </label>
                <Input
                  type="text"
                  inputMode="decimal"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="Enter amount"
                  className="h-[50px] rounded-full border-[#e1e1e1] bg-white px-4"
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="text-[#E84C25] text-xs mt-2 px-4">
                    {field.state.meta.errors[0]}
                  </p>
                )}
                <p className="text-[#69737c] text-xs mt-2 px-4">
                  Available: {(currentBalance - transferFee).toFixed(2)} OGY (after fee)
                </p>
              </div>
            )}
          </form.Field>

          {/* Recipient Address Input */}
          <form.Field
            name="recipientAddress"
            validators={{
              onChange: ({ value }) => {
                if (!value || value.trim() === "") {
                  return "Recipient address is required";
                }

                try {
                  Principal.fromText(value.trim());
                  return undefined;
                } catch (error) {
                  console.error(error);
                  return "Please enter a valid Internet Computer Principal ID";
                }
              },
              onChangeAsyncDebounceMs: 500,
            }}
          >
            {(field) => (
              <div className="w-full">
                <label className="text-[#6f6d66] text-sm font-medium mb-2 block">
                  Recipient Address
                </label>
                <Input
                  type="text"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="Enter recipient address"
                  className="h-[50px] rounded-full border-[#e1e1e1] bg-white px-4"
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="text-[#E84C25] text-xs mt-2 px-4">
                    {field.state.meta.errors[0]}
                  </p>
                )}
              </div>
            )}
          </form.Field>
        </div>
      </div>

      {/* Recap Section */}
      <div className="bg-white border-t border-[#e1e1e1] px-5 py-8">
        <div className="flex justify-between items-start mb-6">
          <div className="flex flex-col gap-2">
            <h3 className="text-[#222526] text-base font-medium">Amount</h3>
            <p className="text-[#69737c] text-xs">Transaction Fee</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2">
              <img src={icon} alt="logo" className="w-4 h-4" />
              <span className="text-[#222526] text-base font-semibold">
                <form.Subscribe
                  selector={(state) => state.values.amount}
                  children={(amount) => `${amount || "0"} OGY`}
                />
              </span>
            </div>
            <p className="text-[#69737c] text-sm">{transferFee} OGY</p>
          </div>
        </div>

        {/* Transfer Button */}
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <Button
              type="submit"
              className="w-full bg-[#222526] text-white hover:bg-[#222526]/90 rounded-full h-12 text-sm font-semibold"
              disabled={!canSubmit || isSubmitting}
            >
              {isSubmitting ? "Processing..." : "Transfer OGY"}
            </Button>
          )}
        />
      </div>

      {/* Current Balance Section */}
      <div className="bg-[#fcfafa] border-t border-[#e1e1e1] px-4 py-4">
        <div className="flex items-center justify-center gap-2">
          <span className="text-[#69737c] text-xs font-medium uppercase tracking-wide">
            Current balance:
          </span>
          <img src={icon} alt="logo" className="w-3 h-3" />
          <span className="text-[#69737c] text-sm font-semibold">
            {currentBalance.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}{" "}
            OGY
          </span>
        </div>
      </div>
    </form>
  );
}
