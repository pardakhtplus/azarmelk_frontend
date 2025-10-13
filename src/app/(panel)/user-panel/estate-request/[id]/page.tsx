import PanelBodyHeader from "@/app/(panel)/_components/PanelBodyHeader";
import { IPenToSquare } from "@/components/Icons";
import Button from "@/components/modules/buttons/Button";
import Link from "next/link";
import { Suspense } from "react";
import EstateRequest from "./_components/EstateRequest";

export default async function EstateRequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  return (
    <Suspense>
      <PanelBodyHeader
        title="درخواست ملک"
        breadcrumb={
          <>
            <Link href="/user-panel">پنل کاربری</Link> /{" "}
            <Link href="/user-panel/estate-request">لیست درخواست های ملک</Link>
          </>
        }>
        <Button
          href={`/user-panel/estate-request/edit/${id}`}
          variant="blue"
          className="max-md:!size-11 max-md:!px-0">
          <span className="hidden md:block">ویرایش</span>
          <IPenToSquare className="size-5 md:mr-0.5" />
        </Button>
      </PanelBodyHeader>
      <EstateRequest />
    </Suspense>
  );
}
