"use client";

import { ESTATE_STATUS } from "@/enums";
import useSearchQueries from "@/hooks/useSearchQueries";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import PanelBodyHeader from "../../_components/PanelBodyHeader";
import EstatesContainer from "./_components/EstatesContainer";

export default function EstatesPage() {
  const searchParams = useSearchParams();
  const searchQuery = useSearchQueries();

  const activeTab =
    searchParams.get("status") === ESTATE_STATUS.PUBLISH
      ? ESTATE_STATUS.PUBLISH
      : searchParams.get("status") === ESTATE_STATUS.PENDING
        ? ESTATE_STATUS.PENDING
        : "ALL";

  return (
    <Suspense>
      <PanelBodyHeader
        title="مدیریت فایل ها"
        breadcrumb={
          <>
            <Link href="/dashboard">داشبورد</Link> /{" "}
            <Link href="/dashboard/estates">مدیریت فایل ها</Link>
          </>
        }
        className="gap-y-5 max-sm:flex-col"
        childrenClassName="max-sm:mr-0 max-sm:w-full">
        <div className="flex flex-wrap items-center gap-4 max-sm:w-full max-sm:flex-col">
          <div className="relative z-[1] flex items-center rounded-xl border border-primary-border p-1 max-sm:w-full max-sm:flex-col sm:rounded-full">
            <div className="absolute inset-0 -z-[1] flex size-full items-center p-1 transition-all max-sm:hidden">
              <div
                className="-z-[1] h-full w-24 rounded-full bg-primary transition-all duration-300"
                style={{
                  transform:
                    activeTab === "ALL"
                      ? "translateX(0)"
                      : activeTab === ESTATE_STATUS.PUBLISH
                        ? "translateX(-100%)"
                        : activeTab === ESTATE_STATUS.PENDING
                          ? "translateX(-200%)"
                          : "translateX(0)",
                }}
              />
            </div>
            <button
              className={`w-full rounded-lg py-2.5 text-sm transition-colors sm:w-24 sm:rounded-full ${activeTab === "ALL" ? "text-white max-sm:bg-primary-blue" : "text-primary-300"}`}
              onClick={() => searchQuery(["status"], [""])}>
              همه
            </button>
            <button
              className={`w-full rounded-lg py-2.5 text-sm transition-colors sm:w-24 sm:rounded-full ${activeTab === ESTATE_STATUS.PUBLISH ? "text-white max-sm:bg-primary-blue" : "text-primary-300"}`}
              onClick={() => searchQuery(["status"], [ESTATE_STATUS.PUBLISH])}>
              فعال
            </button>
            <button
              className={`w-full rounded-lg py-2.5 text-sm transition-colors sm:w-24 sm:rounded-full ${activeTab === ESTATE_STATUS.PENDING ? "text-white max-sm:bg-primary-blue" : "text-primary-300"}`}
              onClick={() => searchQuery(["status"], [ESTATE_STATUS.PENDING])}>
              غیر فعال
            </button>
          </div>
        </div>
      </PanelBodyHeader>
      <EstatesContainer
        filter="all-estates"
        status={activeTab === "ALL" ? undefined : (activeTab as ESTATE_STATUS)}
        archiveStatus="NOTHING"
      />
    </Suspense>
  );
}
