// shared/ui/button/Button.tsx
import { cn } from "@shared/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "pill";
  size?: "sm" | "md" | "lg";
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = ({
  variant = "primary",
  size = "md",
  leftIcon,
  rightIcon,
  children,
  className,
  ...props
}: ButtonProps) => {
  const variants = {
    primary: "bg-[#061937] text-white",
    secondary: "bg-white text-[#061937] border border-[#e1e1e1]",
    ghost: "bg-transparent text-[#615bff]",
    pill: "bg-white rounded-full border border-[#e1e1e1]",
  };

  const sizes = {
    sm: "h-8 px-3 text-[12px]",
    md: "h-[47px] px-4 text-[14px]",
    lg: "h-14 px-6 text-[16px]",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-[20px]",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {leftIcon}
      {children}
      {rightIcon}
    </button>
  );
};
