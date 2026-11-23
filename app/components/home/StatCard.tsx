import React from "react";
import { LucideIcon, ArrowUp, ArrowDown } from "lucide-react";
import Card from "./Card";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  change?: {
    value: number;
    isPositive: boolean;
  };
  color?: "blue" | "green" | "purple" | "orange";
}

const StatCard = ({
  icon: Icon,
  label,
  value,
  change,
  color = "blue",
}: StatCardProps) => {
  const colorClasses = {
    blue: "text-blue-600 bg-blue-900/30",
    green: "text-green-600 bg-green-900/30",
    purple: "text-purple-600 bg-purple-900/30",
    orange: "text-orange-600 bg-orange-900/30",
  };

  return (
    <Card>
      <div className="flex items-start gap-4">
        <div
          className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[color]}`}
        >
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <p className="text-slate-600 dark:text-slate-400 text-sm">{label}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
          {change && (
            <p
              className={`text-xs mt-2 flex items-center gap-1 ${change.isPositive ? "text-green-600" : "text-red-600"}`}
            >
              {change.isPositive ? (
                <ArrowUp size={12} />
              ) : (
                <ArrowDown size={12} />
              )}{" "}
              {change.value}%
            </p>
          )}
        </div>
      </div>
    </Card>
  );
};

export default StatCard;
