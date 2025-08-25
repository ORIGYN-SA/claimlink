// shared/ui/card/Card.tsx
import { cn } from "@shared/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "bordered" | "elevated";
  padding?: "none" | "sm" | "md" | "lg";
}

export const Card = ({
  children,
  className,
  variant = "default",
  padding = "md",
}: CardProps) => {
  const variants = {
    default: "bg-white rounded-2xl",
    bordered: "bg-white rounded-2xl border border-[#f2f2f2]",
    elevated: "bg-white rounded-2xl shadow-[0_2px_4px_0_rgba(0,0,0,0.05)]",
  };

  const paddings = {
    none: "",
    sm: "p-3",
    md: "p-4",
    lg: "p-6",
  };

  return (
    <div className={cn(variants[variant], paddings[padding], className)}>
      {children}
    </div>
  );
};
