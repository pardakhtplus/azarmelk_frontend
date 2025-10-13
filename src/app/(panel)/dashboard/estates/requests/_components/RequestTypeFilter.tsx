 "use client";

import { Filter } from "lucide-react";
import ComboBox from "@/components/modules/ComboBox";

interface RequestTypeFilterProps {
  selectedType: {
    key: string;
    title: string;
  };
  onTypeChange: (option: { key: string; title: string }) => void;
  typeOptions: Array<{ key: string; title: string }>;
}

export default function RequestTypeFilter({
  selectedType,
  onTypeChange,
  typeOptions,
}: RequestTypeFilterProps) {
  return (
    <div className="mb-6 flex items-center gap-4">
      <div className="flex items-center gap-2">
        <Filter className="size-5 text-gray-500" />
        <span className="text-sm font-medium text-gray-700">
          نوع درخواست:
        </span>
      </div>
      <ComboBox
        options={typeOptions}
        value={selectedType.title}
        onChange={onTypeChange}
        className="w-48"
        dropDownClassName="w-full"
      />
    </div>
  );
}