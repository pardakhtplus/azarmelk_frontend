import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  color?: "blue" | "green" | "orange" | "red" | "purple" | "indigo";
  isLoading?: boolean;
}

const colorClasses = {
  blue: "bg-blue-50 text-blue-600 border-blue-100",
  green: "bg-green-50 text-green-600 border-green-100",
  orange: "bg-orange-50 text-orange-600 border-orange-100",
  red: "bg-red-50 text-red-600 border-red-100",
  purple: "bg-purple-50 text-purple-600 border-purple-100",
  indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
};

export default function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  color = "blue",
  isLoading = false,
}: StatCardProps) {
  if (isLoading) {
    return (
      <div className="animate-pulse rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-3">
            <div className="h-4 w-24 rounded bg-gray-200" />
            <div className="h-8 w-32 rounded bg-gray-200" />
          </div>
          <div className="size-12 rounded-lg bg-gray-200" />
        </div>
      </div>
    );
  }

  return (
    <div className="group rounded-xl border border-gray-200 bg-white px-6 py-4 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
          {trend && (
            <div className="mt-2 flex items-center gap-1">
              <span
                className={cn(
                  "text-xs font-medium",
                  trend.isPositive ? "text-green-600" : "text-red-600",
                )}>
                {trend.isPositive ? "↑" : "↓"} {trend.value}
              </span>
              <span className="text-xs text-gray-500">از ماه قبل</span>
            </div>
          )}
        </div>
        <div
          className={cn(
            "my-auto flex size-12 items-center justify-center rounded-lg border transition-all group-hover:scale-110",
            colorClasses[color],
          )}>
          <Icon className="size-6" />
        </div>
      </div>
    </div>
  );
}
