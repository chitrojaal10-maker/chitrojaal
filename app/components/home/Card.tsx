import React from "react";

interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  disablePadding?: boolean; // New prop
}

const Card = ({
  children,
  title,
  subtitle,
  className = "",
  disablePadding = false, // Default to false
}: CardProps) => {
  return (
    <div
      className={`bg-neutral-900/50 border border-neutral-800 rounded-xl shadow-sm transition-colors hover:border-orange-500/20 ${className}`}
    >
      {(title || subtitle) && (
        <div className="p-5 border-b border-neutral-800">
          {title && (
            <h2 className="text-lg font-semibold text-white">{title}</h2>
          )}
          {subtitle && (
            <p className="text-sm text-neutral-400 mt-1">{subtitle}</p>
          )}
        </div>
      )}
      <div className={`${disablePadding ? "" : "p-5"}`}>{children}</div> {/* Conditionally apply padding */}
    </div>
  );
};

export default Card;
