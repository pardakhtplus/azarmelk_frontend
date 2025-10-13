"use client";

import Link from "next/link";
import { Suspense } from "react";
import PanelBodyHeader from "../../../_components/PanelBodyHeader";
import EstatesContainer from "../../../dashboard/estates/_components/EstatesContainer";

export default function EstatesSavedPage() {
  return (
    <Suspense>
      <PanelBodyHeader
        title="فایل های ذخیره شده"
        breadcrumb={
          <>
            <Link href="/user-panel">داشبورد</Link> /{" "}
            <Link href="/user-panel/estates/saved">فایل های ذخیره شده</Link>
          </>
        }
        className="gap-y-5 max-sm:flex-col"
        childrenClassName="max-sm:mr-0 max-sm:w-full"
      />
      <EstatesContainer
        filter="saved-estates"
        archiveStatus="NOTHING"
        isUserPanel={true}
      />
    </Suspense>
  );
}
