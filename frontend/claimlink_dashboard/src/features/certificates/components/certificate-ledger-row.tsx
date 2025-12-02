import type { LedgerTransaction, LedgerTransactionType } from "./certificate-ledger";

// Icon assets from Figma
const iconBurned = "http://localhost:3845/assets/3dcac31834ea8bf3c728095682ca2d134143e20f.svg";
const iconTransferred = "http://localhost:3845/assets/6e65eda2d7538f31946882b6cbdf4071648c29b4.svg";
const iconMinted = "http://localhost:3845/assets/b5974d93b713bbeb310a973d9db1cccdaf21d4ab.svg";
const iconVerified = "http://localhost:3845/assets/bc0051f689280b292bb04d16b2255aa59f8ed2dd.svg";
const iconAvatar = "http://localhost:3845/assets/008e407774e546ecf687917d90fd9048206f7402.svg";

interface CertificateLedgerRowProps {
  transaction: LedgerTransaction;
  isEven: boolean;
}

interface TransactionBadgeProps {
  type: LedgerTransactionType;
}

function TransactionBadge({ type }: TransactionBadgeProps) {
  const getBadgeConfig = () => {
    switch (type) {
      case "Burned":
        return {
          icon: iconBurned,
          label: "Burned",
          bgColor: "bg-white",
        };
      case "Transferred":
        return {
          icon: iconTransferred,
          label: "Transferred",
          bgColor: "bg-white",
        };
      case "Minted":
        return {
          icon: iconMinted,
          label: "Minted",
          bgColor: "bg-white",
        };
    }
  };

  const config = getBadgeConfig();

  return (
    <div
      className={`${config.bgColor} border border-[rgba(225,225,225,0.5)] flex gap-2 h-7 items-center px-2 py-1 rounded-full`}
    >
      <img alt="" className="size-[10px]" src={config.icon} />
      <p className="text-[#222526] text-[12px] font-medium leading-normal">
        {config.label}
      </p>
    </div>
  );
}

interface AddressDisplayProps {
  address: string;
  addressShort: string;
  verified?: boolean;
}

function AddressDisplay({
  addressShort,
  verified = false,
}: AddressDisplayProps) {
  if (verified) {
    return (
      <div className="flex gap-1.5 items-center">
        {/* Avatar Icon */}
        <div className="relative size-6 shrink-0">
          <div className="absolute inset-0 bg-[#233169] rounded-2xl" />
          <img
            alt=""
            className="absolute inset-0 size-full p-[7px]"
            src={iconAvatar}
          />
        </div>
        <p className="text-[#69737c] text-[14px] font-medium leading-4">
          {addressShort}
        </p>
        {/* Verified Badge */}
        <img alt="Verified" className="size-4 shrink-0" src={iconVerified} />
      </div>
    );
  }

  return (
    <p className="text-[#69737c] text-[14px] font-medium leading-4">
      {addressShort}
    </p>
  );
}

export function CertificateLedgerRow({
  transaction,
  isEven,
}: CertificateLedgerRowProps) {
  const bgClass = isEven
    ? "bg-white"
    : "bg-[linear-gradient(90deg,rgba(249,250,254,0.5)_0%,rgba(249,250,254,0.5)_100%)]";

  return (
    <div
      className={`${bgClass} border-b border-[#e1e1e1] last:border-b-0 flex gap-4 items-center px-6 py-4`}
    >
      {/* From */}
      <div className="flex-1 min-w-0">
        <AddressDisplay
          address={transaction.from}
          addressShort={transaction.fromShort}
          verified={transaction.fromVerified}
        />
      </div>

      {/* To */}
      <div className="flex-1 min-w-0">
        <AddressDisplay
          address={transaction.to}
          addressShort={transaction.toShort}
          verified={transaction.toVerified}
        />
      </div>

      {/* Type */}
      <div className="w-[150px] shrink-0">
        <TransactionBadge type={transaction.type} />
      </div>

      {/* Hash */}
      <div className="w-[100px] shrink-0">
        <p className="text-[#69737c] text-[14px] font-normal leading-4">
          {transaction.hash}
        </p>
      </div>

      {/* Date */}
      <div className="w-[100px] shrink-0">
        <p className="text-[#69737c] text-[14px] font-normal leading-4">
          {transaction.date}
        </p>
      </div>
    </div>
  );
}

