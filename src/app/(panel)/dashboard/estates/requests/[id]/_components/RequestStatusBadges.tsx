"use client";

import { cn } from "@/lib/utils";
import {
  type REQUEST_STATUS,
  type REQUEST_TYPE,
} from "@/types/admin/estate/enum";
import {
  getStatusColor,
  getStatusIcon,
  getStatusPersianName,
  getTypeColor,
  getTypeIcon,
  getTypePersianName,
} from "../../_components/RequestUtils";

interface RequestStatusBadgesProps {
  status: REQUEST_STATUS;
  type: REQUEST_TYPE;
}

export default function RequestStatusBadges({
  status,
  type,
}: RequestStatusBadgesProps) {
  return (
    <div className="mr-auto flex flex-wrap items-center gap-4">
      <div
        className={cn(
          "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold",
          getStatusColor(status),
        )}>
        {getStatusIcon(status)}
        {getStatusPersianName(status)}
      </div>
      <div
        className={cn(
          "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold",
          getTypeColor(type),
        )}>
        {getTypeIcon(type)}
        {getTypePersianName(type)}
      </div>
    </div>
  );
}
