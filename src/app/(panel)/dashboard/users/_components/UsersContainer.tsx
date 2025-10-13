"use client";

import PanelBodyHeader from "@/app/(panel)/_components/PanelBodyHeader";
import { Table, TableContainer, TableHeader } from "@/components/modules/Table";
import { FeatureFlag, isFeatureEnabled } from "@/config/features";
import useSearchQueries from "@/hooks/useSearchQueries";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import TableContent from "./TableContent";
import { SearchIcon } from "lucide-react";
import SearchModal from "./SearchModal";

export default function UsersContainer() {
  const searchParams = useSearchParams();
  const searchQuery = useSearchQueries();
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  const activeTab =
    searchParams.get("type") === "personnel"
      ? "personnel"
      : searchParams.get("type") === "owners"
        ? "owners"
        : "users";

  const currentSearchTerm = searchParams.get("search") || "";

  const handleSearch = (searchTerm: string) => {
    searchQuery(["search"], [searchTerm]);
  };

  if (!isFeatureEnabled(FeatureFlag.USERS)) {
    return null;
  }

  return (
    <>
      <PanelBodyHeader className="gap-y-4" title="مدیریت کاربران">
        <div className="flex w-full flex-wrap items-center gap-3">
          <button
            className="relative flex aspect-square size-[50px] items-center justify-center rounded-full border border-primary-border transition-colors hover:bg-primary-border/30"
            onClick={() => setIsSearchModalOpen(true)}>
            <SearchIcon className="size-6 text-text-300" strokeWidth={1.4} />
            {searchParams.get("search") && (
              <>
                <div className="absolute right-0 top-0 size-2.5 rounded-full bg-red" />
                <div className="absolute right-0 top-0 size-2.5 animate-ping rounded-full bg-red" />
              </>
            )}
          </button>
          <div className="relative z-[1] flex h-[50px] items-center rounded-full border border-primary-border p-1">
            <div className="absolute inset-0 -z-[1] flex size-full items-center p-1 transition-all">
              <div
                className="-z-[1] h-full w-24 rounded-full bg-primary transition-all duration-300"
                style={{
                  transform:
                    activeTab === "users"
                      ? "translateX(0)"
                      : activeTab === "owners"
                        ? "translateX(-200%)"
                        : "translateX(-100%)",
                  marginLeft: activeTab === "personnel" ? "auto" : "0",
                }}
              />
            </div>
            <button
              className={`h-[50px] w-24 rounded-full transition-colors ${activeTab === "users" ? "text-white" : "text-primary-300"}`}
              onClick={() => searchQuery(["type"], ["users"])}>
              کاربران
            </button>
            <button
              className={`h-[50px] w-24 rounded-full transition-colors ${activeTab === "personnel" ? "text-white" : "text-primary-300"}`}
              onClick={() => searchQuery(["type"], ["personnel"])}>
              پرسنل
            </button>
            <button
              className={`h-[50px] w-24 rounded-full transition-colors ${activeTab === "owners" ? "text-white" : "text-primary-300"}`}
              onClick={() => searchQuery(["type"], ["owners"])}>
              مالک ها
            </button>
          </div>
        </div>
      </PanelBodyHeader>

      <TableContainer className="mt-7 !min-w-0 sm:mt-10">
        <Suspense>
          <Table>
            <TableHeader>
              <div className="basis-full xl:shrink-0 xl:basis-3/12">
                نام و نام خانوادگی
              </div>
              <div className="hidden shrink-0 basis-2/12 xl:block">
                شماره همراه
              </div>
              <div className="hidden shrink-0 basis-2/12 xl:block">
                تاریخ عضویت
              </div>
              <div className="hidden shrink-0 basis-2/12 xl:block">
                تعداد فایل ها
              </div>
              <div className="hidden shrink-0 xl:block">عملیات</div>
            </TableHeader>
            <TableContent />
          </Table>
        </Suspense>
      </TableContainer>

      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onSearch={handleSearch}
        searchValue={currentSearchTerm}
      />
    </>
  );
}
