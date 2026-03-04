import { cn } from "@/lib/utils";

interface GridOnlyContainerProps {
  title: string;
  totalCount: number;
  className?: string;
  children: React.ReactNode;
}

export function GridOnlyContainer({
  title,
  totalCount,
  className,
  children
}: GridOnlyContainerProps) {
  return (
    <div className={cn(
      "bg-white border border-[#f2f2f2] rounded-t-2xl rounded-b-none shadow-none",
      className
    )}>
      <div className="p-4 space-y-4">
        {/* Title */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="font-sans font-medium text-[#222526] text-lg leading-normal">
              {title}{" "}
              <span className="text-[#69737c]">
                ({totalCount})
              </span>
            </h2>
          </div>
        </div>

        {/* Content */}
        {children}
      </div>
    </div>
  );
}
