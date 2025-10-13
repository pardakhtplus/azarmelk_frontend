import { ChevronUpIcon, ChevronDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimePickerProps {
  hours: number;
  minutes: number;
  onHoursChange: (hours: number) => void;
  onMinutesChange: (minutes: number) => void;
}

export default function TimePicker({
  hours,
  minutes,
  onHoursChange,
  onMinutesChange,
}: TimePickerProps) {
  const incrementHours = () => {
    onHoursChange(hours >= 23 ? 0 : hours + 1);
  };

  const decrementHours = () => {
    onHoursChange(hours <= 0 ? 23 : hours - 1);
  };

  const incrementMinutes = () => {
    onMinutesChange(minutes >= 59 ? 0 : minutes + 1);
  };

  const decrementMinutes = () => {
    onMinutesChange(minutes <= 0 ? 59 : minutes - 1);
  };

  const timePresets = [
    { label: "09:00", h: 9, m: 0 },
    { label: "12:00", h: 12, m: 0 },
    { label: "14:00", h: 14, m: 0 },
    { label: "18:00", h: 18, m: 0 },
  ];

  return (
    <div className="mb-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-center gap-2">
        <svg
          className="size-5 text-blue-600"
          fill="currentColor"
          viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
            clipRule="evenodd"
          />
        </svg>
        <label className="text-sm font-semibold text-blue-900">
          انتخاب ساعت
        </label>
      </div>

      <div className="flex items-center justify-center gap-8">
        {/* Minutes */}
        <div className="flex flex-col items-center">
          <button
            type="button"
            onClick={incrementMinutes}
            className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-md transition-all duration-200 hover:bg-blue-50 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 active:scale-95">
            <ChevronUpIcon className="size-5 text-blue-600" />
          </button>
          <div className="flex h-16 w-20 items-center justify-center rounded-xl bg-white text-2xl font-bold text-gray-800 shadow-md ring-1 ring-blue-100">
            {minutes.toString().padStart(2, "0")}
          </div>
          <button
            type="button"
            onClick={decrementMinutes}
            className="mt-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-md transition-all duration-200 hover:bg-blue-50 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 active:scale-95">
            <ChevronDownIcon className="size-5 text-blue-600" />
          </button>
          <span className="mt-2 text-sm font-medium text-blue-700">دقیقه</span>
        </div>

        {/* Separator */}
        <div className="pb-8 text-3xl font-bold text-blue-400">:</div>

        {/* Hours */}
        <div className="flex flex-col items-center">
          <button
            type="button"
            onClick={incrementHours}
            className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-md transition-all duration-200 hover:bg-blue-50 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 active:scale-95">
            <ChevronUpIcon className="size-5 text-blue-600" />
          </button>
          <div className="flex h-16 w-20 items-center justify-center rounded-xl bg-white text-2xl font-bold text-gray-800 shadow-md ring-1 ring-blue-100">
            {hours.toString().padStart(2, "0")}
          </div>
          <button
            type="button"
            onClick={decrementHours}
            className="mt-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-md transition-all duration-200 hover:bg-blue-50 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 active:scale-95">
            <ChevronDownIcon className="size-5 text-blue-600" />
          </button>
          <span className="mt-2 text-sm font-medium text-blue-700">ساعت</span>
        </div>
      </div>

      {/* Quick time presets */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
        <span className="text-xs font-medium text-blue-700">انتخاب سریع:</span>
        {timePresets.map((preset) => (
          <button
            key={preset.label}
            type="button"
            onClick={() => {
              onHoursChange(preset.h);
              onMinutesChange(preset.m);
            }}
            className={cn(
              "rounded-lg border border-blue-200 bg-white px-3 py-1 text-xs font-medium text-blue-700 transition-all duration-200 hover:border-blue-300 hover:bg-blue-50",
              hours === preset.h &&
                minutes === preset.m &&
                "!border-blue-600 !bg-blue-600 !text-white",
            )}>
            {preset.label}
          </button>
        ))}
      </div>
    </div>
  );
}
