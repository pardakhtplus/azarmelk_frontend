"use client";

import EstateCardItem from "@/components/modules/estate/EstateCardItem";
import { type TEstate } from "@/types/types";
import { CheckIcon } from "lucide-react";

interface Props {
  estate: TEstate;
  isSelected: boolean;
  onSelect: (estate: TEstate) => void;
}

export default function SelectableEstateCard({
  estate,
  isSelected,
  onSelect,
}: Props) {
  return (
    <div className="group relative h-full">
      {/* Selection Checkbox */}
      <div className="absolute right-3 top-3 z-10">
        <button
          type="button"
          onClick={() => onSelect(estate)}
          className={`flex size-6 items-center justify-center rounded-full border-2 transition-all ${
            isSelected
              ? "border-primary-blue bg-primary-blue text-white"
              : "border-gray-300 bg-white/80 text-transparent hover:border-primary-blue hover:bg-white"
          }`}>
          {isSelected && <CheckIcon className="size-4" />}
        </button>
      </div>

      {/* Estate Card */}
      <div
        className={`h-full transition-all ${isSelected ? "rounded-2xl ring-2 ring-primary-blue ring-offset-2" : ""}`}>
        <EstateCardItem estate={estate} />
      </div>

      {/* Selection Overlay */}
      {isSelected && (
        <div className="pointer-events-none absolute inset-0 rounded-2xl bg-primary-blue/5" />
      )}
    </div>
  );
}
