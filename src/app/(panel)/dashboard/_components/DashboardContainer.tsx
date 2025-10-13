"use client";

import PanelBodyHeader from "@/app/(panel)/_components/PanelBodyHeader";
import Link from "next/link";

export default function DashboardContainer() {
  return (
    <>
      <PanelBodyHeader
        title="داشبورد"
        breadcrumb={
          <>
            <Link href="/dashboard">داشبورد</Link>
          </>
        }
      />
    </>
  );
}
