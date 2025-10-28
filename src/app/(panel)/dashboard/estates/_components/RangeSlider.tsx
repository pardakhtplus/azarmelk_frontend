"use client";

import BorderedInput from "@/components/modules/inputs/BorderedInput";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface RangeSliderProps {
  min: number;
  max: number;
  step?: number;
  minValue: number | null;
  maxValue: number | null;
  onMinChange: (value: number | null) => void;
  onMaxChange: (value: number | null) => void;
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
  className,
}: RangeSliderProps) {
  const [localMinValue, setLocalMinValue] = useState<number | null>(minValue);
  const [localMaxValue, setLocalMaxValue] = useState<number | null>(maxValue);

  useEffect(() => {
    setLocalMinValue(minValue);
  }, [minValue]);

  useEffect(() => {
    setLocalMaxValue(maxValue);
  }, [maxValue]);

  const handleMinChange = (value: string) => {
    if (value === "") {
      setLocalMinValue(null);
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
      setLocalMaxValue(null);
    } else {
      const numValue = parseInt(value);
      if (!isNaN(numValue)) {
        setLocalMaxValue(numValue);
        onMaxChange(numValue);
      }
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Input Fields */}
      <div className="flex items-center gap-3">
        {/* Min Value */}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <BorderedInput
              name="min"
              type="number"
              min={min}
              max={max}
              step={step}
              value={localMinValue?.toString() || ""}
              onChange={(e) => handleMinChange(e.target.value)}
              placeholder="حداقل"
              className="!h-auto flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-blue focus:outline-none focus:ring-2 focus:ring-primary-blue/20"
            />
          </div>
        </div>

        {/* Separator */}
        <div className="text-sm text-gray-400">تا</div>

        {/* Max Value */}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <BorderedInput
              name="max"
              type="number"
              min={min}
              max={max}
              step={step}
              value={localMaxValue?.toString() || ""}
              onChange={(e) => handleMaxChange(e.target.value)}
              placeholder="حداکثر"
              className="!h-auto flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-blue focus:outline-none focus:ring-2 focus:ring-primary-blue/20"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
