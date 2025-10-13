"use client";

import Input from "@/components/modules/inputs/Input";
import { cn } from "@/lib/utils";
import { MinusIcon, PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { getTrackBackground, Range } from "react-range";

interface RangeSliderProps {
  min: number;
  max: number;
  step?: number;
  minValue: number | null;
  maxValue: number | null;
  onMinChange: (value: number | null) => void;
  onMaxChange: (value: number | null) => void;
  disabled?: boolean;
  className?: string;
}

export default function RangeSlider({
  min,
  max,
  step = 1,
  minValue,
  maxValue,
  onMinChange,
  onMaxChange,
  disabled = false,
  className,
}: RangeSliderProps) {
  const [localMinValue, setLocalMinValue] = useState<number | null>(minValue);
  const [localMaxValue, setLocalMaxValue] = useState<number | null>(maxValue);
  const [isMinDisabled, setIsMinDisabled] = useState<boolean>(
    minValue === null,
  );
  const [isMaxDisabled, setIsMaxDisabled] = useState<boolean>(
    maxValue === null,
  );

  useEffect(() => {
    setLocalMinValue(minValue);
    setIsMinDisabled(minValue === null);
  }, [minValue]);

  useEffect(() => {
    setLocalMaxValue(maxValue);
    setIsMaxDisabled(maxValue === null);
  }, [maxValue]);

  const handleMinChange = (value: string) => {
    if (value === "") {
      // Don't set to null when input is empty, just update local state
      setLocalMinValue(null);
      // Don't call onMinChange to keep the slider enabled
    } else {
      const numValue = parseInt(value);
      if (!isNaN(numValue)) {
        setLocalMinValue(numValue);
        onMinChange(numValue);
      }
    }
  };

  const handleMaxChange = (value: string) => {
    if (value === "") {
      // Don't set to null when input is empty, just update local state
      setLocalMaxValue(null);
      // Don't call onMinChange to keep the slider enabled
    } else {
      const numValue = parseInt(value);
      if (!isNaN(numValue)) {
        setLocalMaxValue(numValue);
        onMaxChange(numValue);
      }
    }
  };

  const toggleMin = () => {
    if (isMinDisabled) {
      setIsMinDisabled(false);
      setLocalMinValue(min);
      onMinChange(min);
    } else {
      setIsMinDisabled(true);
      setLocalMinValue(null);
      onMinChange(null);
    }
  };

  const toggleMax = () => {
    if (isMaxDisabled) {
      setIsMaxDisabled(false);
      setLocalMaxValue(max);
      onMaxChange(max);
    } else {
      setIsMaxDisabled(true);
      setLocalMaxValue(null);
      onMaxChange(null);
    }
  };

  const handleRangeChange = (values: number[]) => {
    if (values.length === 2) {
      if (!isMinDisabled) {
        setLocalMinValue(values[0]);
        onMinChange(values[0]);
      }
      if (!isMaxDisabled) {
        setLocalMaxValue(values[1]);
        onMaxChange(values[1]);
      }
    }
  };

  // Prepare values for react-range
  const rangeValues = [
    isMinDisabled ? min : localMinValue || min,
    isMaxDisabled ? max : localMaxValue || max,
  ];

  return (
    <div className={cn("space-y-4", className)}>
      {/* Range Slider */}
      <div className="px-2">
        <Range
          values={rangeValues}
          step={step}
          rtl={true}
          min={min}
          max={max}
          disabled={disabled}
          onChange={handleRangeChange}
          renderTrack={({ props, children }) => (
            <div
              {...props}
              className="flex h-2 w-full rounded-full"
              style={{
                background: getTrackBackground({
                  values: rangeValues,
                  colors: ["#e5e7eb", "#3b82f6", "#e5e7eb"],
                  min: min,
                  max: max,
                  rtl: true,
                }),
                height: "8px",
                borderRadius: "9999px",
                width: "100%",
              }}>
              {children}
            </div>
          )}
          renderThumb={({ props, isDragged, index }) => (
            <div
              {...props}
              key={`thumb-${index}`}
              className={cn(
                "flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-primary-blue shadow-lg hover:scale-110",
                isDragged && "ring-2 ring-primary-blue/50",
                disabled && "opacity-50",
                (index === 0 && isMinDisabled) || (index === 1 && isMaxDisabled)
                  ? "opacity-30"
                  : "",
              )}
              style={{ ...props.style, outline: "none" }}
              onMouseDown={() => {
                if (index === 0 && isMinDisabled) {
                  toggleMin();
                }
                if (index === 1 && isMaxDisabled) {
                  toggleMax();
                }
                }}>
              <div className="h-2 w-2 rounded-full bg-white" />
            </div>
          )}
        />
      </div>

      {/* Input Fields */}
      <div className="flex items-center gap-3">
        {/* Min Value */}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleMin}
              disabled={disabled}
              className={cn(
                "flex size-6 shrink-0 items-center justify-center rounded-full border transition-all",
                isMinDisabled
                  ? "border-gray-300 bg-gray-100 text-gray-400"
                  : "border-primary-blue bg-primary-blue text-white hover:bg-primary-blue/90",
              )}
              title={isMinDisabled ? "فعال کردن حداقل" : "غیرفعال کردن حداقل"}>
              {isMinDisabled ? <PlusIcon size={12} /> : <MinusIcon size={12} />}
            </button>
            <Input
              name="min"
              type="number"
              min={min}
              max={max}
              step={step}
              value={isMinDisabled ? "" : localMinValue?.toString() || ""}
              onChange={(e) => handleMinChange(e.target.value)}
              disabled={disabled || isMinDisabled}
              placeholder="حداقل"
              className="!h-auto flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-blue focus:outline-none focus:ring-2 focus:ring-primary-blue/20 disabled:bg-gray-100 disabled:text-gray-400"
            />
          </div>
        </div>

        {/* Separator */}
        <div className="text-sm text-gray-400">تا</div>

        {/* Max Value */}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Input
              name="max"
              type="number"
              min={min}
              max={max}
              step={step}
              value={isMaxDisabled ? "" : localMaxValue?.toString() || ""}
              onChange={(e) => handleMaxChange(e.target.value)}
              disabled={disabled || isMaxDisabled}
              placeholder="حداکثر"
              className="!h-auto flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-blue focus:outline-none focus:ring-2 focus:ring-primary-blue/20 disabled:bg-gray-100 disabled:text-gray-400"
            />
            <button
              type="button"
              onClick={toggleMax}
              disabled={disabled}
              className={cn(
                "flex size-6 shrink-0 items-center justify-center rounded-full border transition-all",
                isMaxDisabled
                  ? "border-gray-300 bg-gray-100 text-gray-400"
                  : "border-primary-blue bg-primary-blue text-white hover:bg-primary-blue/90",
              )}
              title={
                isMaxDisabled ? "فعال کردن حداکثر" : "غیرفعال کردن حداکثر"
              }>
              {isMaxDisabled ? <PlusIcon size={12} /> : <MinusIcon size={12} />}
            </button>
          </div>
        </div>
      </div>

      {/* Range Labels */}
      <div className="flex justify-between text-xs text-gray-500">
        <span>{min} متر مربع</span>
        <span>{max} متر مربع</span>
      </div>
    </div>
  );
}
