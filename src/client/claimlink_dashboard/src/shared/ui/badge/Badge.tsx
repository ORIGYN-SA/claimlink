// shared/ui/badge/Badge.tsx
import { cn } from "@shared/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "success" | "error" | "info" | "warning" | "neutral";
  size?: "sm" | "md";
  dot?: boolean;
}

export const Badge = ({
  children,
  variant = "neutral",
  size = "sm",
  dot,
}: BadgeProps) => {
  const variants = {
    success: { bg: "#c7f2e0", dot: "#50be8f", text: "#222526" },
    error: { bg: "#ffcec2", dot: "#e84c25", text: "#222526" },
    info: { bg: "#ddddff", dot: "#615bff", text: "#222526" },
    warning: { bg: "#fff4d9", dot: "#f59e0b", text: "#222526" },
    neutral: { bg: "#f3f4f6", dot: "#6b7280", text: "#222526" },
  };

  const sizes = {
    sm: "text-[10px] px-1.5 py-1",
    md: "text-[12px] px-2 py-1",
  };

  const style = variants[variant];

  return (
    <span
      className={cn("inline-flex items-center gap-1 rounded-full", sizes[size])}
      style={{ backgroundColor: style.bg, color: style.text }}
    >
      {dot && (
        <span
          className="h-2 w-2 rounded-full"
          style={{ backgroundColor: style.dot }}
        />
      )}
      {children}
    </span>
  );
};
