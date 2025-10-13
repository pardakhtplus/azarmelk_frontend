"use client";

import PanelBodyHeader from "@/app/(panel)/_components/PanelBodyHeader";
import { Table, TableContainer, TableHeader } from "@/components/modules/Table";
import { FeatureFlag, isFeatureEnabled } from "@/config/features";
import { Suspense } from "react";
import TableContent from "./TableContent";

export default function LandingsContainer() {
  if (!isFeatureEnabled(FeatureFlag.LANDINGS)) {
    return null;
  }

  return (
    <>
      <PanelBodyHeader title="مدیریت لندینگ ها" />
      <TableContainer className="mt-10 !min-w-0">
        <Suspense>
          <Table>
            <TableHeader>
              <div className="basis-full xl:shrink-0 xl:basis-3/12">عنوان</div>
              <div className="hidden shrink-0 basis-2/12 xl:block">
                تاریخ ساخت
              </div>
              <div className="hidden shrink-0 basis-2/12 xl:block">لینک</div>
              <div className="hidden shrink-0 basis-2/12 xl:block">
                تعداد فایل ها
              </div>
              <div className="hidden shrink-0 xl:block">عملیات</div>
            </TableHeader>
            <TableContent />
          </Table>
        </Suspense>
      </TableContainer>
    </>
  );
}
