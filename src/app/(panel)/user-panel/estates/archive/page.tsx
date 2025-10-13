"use client";

import PanelBodyHeader from "@/app/(panel)/_components/PanelBodyHeader";
import { ESTATE_ARCHIVE_STATUS } from "@/enums";
import useSearchQueries from "@/hooks/useSearchQueries";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import EstatesContainer from "../../../dashboard/estates/_components/EstatesContainer";

export default function EstatesPage() {
  const searchParams = useSearchParams();
  const searchQuery = useSearchQueries();

  const activeTab =
    searchParams.get("archiveStatus") === ESTATE_ARCHIVE_STATUS.ARCHIVE
      ? ESTATE_ARCHIVE_STATUS.ARCHIVE
      : searchParams.get("archiveStatus") === ESTATE_ARCHIVE_STATUS.DELETE
        ? ESTATE_ARCHIVE_STATUS.DELETE
        : ESTATE_ARCHIVE_STATUS.ARCHIVE;

  return (
    <Suspense>
      <PanelBodyHeader
        title="فایل های آرشیو"
        breadcrumb={
          <>
            <Link href="/user-panel">داشبورد</Link> /{" "}
            <Link href="/user-panel/estates">فایل های من</Link>
          </>
        }
        className="gap-y-5 max-sm:flex-col"
        childrenClassName="max-sm:mr-0 max-sm:w-full">
        <div className="flex flex-wrap items-center gap-4 max-sm:w-full max-sm:flex-col">
          {/* Toggle for estate filter type */}

          <div className="relative z-[1] flex items-center rounded-xl border border-primary-border p-1 max-sm:w-full max-sm:flex-col sm:rounded-full">
            <div className="absolute inset-0 -z-[1] flex size-full items-center p-1 transition-all max-sm:hidden">
              <div
                className="-z-[1] h-full w-24 rounded-full bg-primary transition-all duration-300"
                style={{
                  transform:
                    activeTab === ESTATE_ARCHIVE_STATUS.ARCHIVE
                      ? "translateX(0)"
                      : activeTab === ESTATE_ARCHIVE_STATUS.DELETE
                        ? "translateX(-100%)"
                        : "translateX(0)",
                }}
              />
            </div>

            <button
              className={`w-full rounded-lg py-2.5 text-sm transition-colors sm:w-24 sm:rounded-full ${activeTab === ESTATE_ARCHIVE_STATUS.ARCHIVE ? "text-white max-sm:bg-primary-blue" : "text-primary-300"}`}
              onClick={() =>
                searchQuery(["archiveStatus"], [ESTATE_ARCHIVE_STATUS.ARCHIVE])
              }>
              بایگانی
            </button>
            <button
              className={`w-full rounded-lg py-2.5 text-sm transition-colors sm:w-24 sm:rounded-full ${activeTab === ESTATE_ARCHIVE_STATUS.DELETE ? "text-white max-sm:bg-primary-blue" : "text-primary-300"}`}
              onClick={() =>
                searchQuery(["archiveStatus"], [ESTATE_ARCHIVE_STATUS.DELETE])
              }>
              حذف
            </button>
          </div>
        </div>
      </PanelBodyHeader>
      <EstatesContainer
        filter="all-estates"
        archiveStatus={activeTab}
        isUserPanel={true}
      />
    </Suspense>
  );
}
