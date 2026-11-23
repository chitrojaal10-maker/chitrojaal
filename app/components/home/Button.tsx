import React from "react";
import { LucideIcon } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  icon?: LucideIcon;
  children: React.ReactNode;
}

const Button = ({
  children,
  variant = "secondary",
  size = "md",
  icon: Icon,
  className = "",
  ...props
}: ButtonProps) => {
  const baseClasses =
    "inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-900";

  const variantClasses = {
    primary:
      "bg-orange-600 text-white hover:bg-orange-500 focus:ring-orange-500 shadow-[0_0_15px_rgba(234,88,12,0.3)]",
    secondary:
      "bg-neutral-800 text-neutral-200 hover:bg-neutral-700 focus:ring-neutral-500 border border-neutral-700",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    ghost: "hover:bg-neutral-800 focus:ring-neutral-500 text-neutral-300",
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </button>
  );
};

export default Button;
