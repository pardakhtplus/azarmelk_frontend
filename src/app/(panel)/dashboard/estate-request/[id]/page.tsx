import PanelBodyHeader from "@/app/(panel)/_components/PanelBodyHeader";
import Link from "next/link";
import { Suspense } from "react";
import EstateRequest from "./_components/EstateRequest";

export default async function EstateRequestDetailPage() {
  return (
    <Suspense>
      <PanelBodyHeader
        title="درخواست ملک"
        breadcrumb={
          <>
            <Link href="/dashboard">پنل کاربری</Link> /{" "}
            <Link href="/dashboard/estate-request">لیست درخواست های ملک</Link>
          </>
        }
      />
      <EstateRequest />
    </Suspense>
  );
}
