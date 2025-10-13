"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import PanelBodyHeader from "../../_components/PanelBodyHeader";
import EstateRequestsContainer from "./_components/EstateRequestsContainer";
import { SearchIcon } from "lucide-react";
import useSearchQueries from "@/hooks/useSearchQueries";
import { useSearchParams } from "next/navigation";

export default function EstatesPage() {
  const searchParams = useSearchParams();
  const searchQueries = useSearchQueries();
  const [search, setSearch] = useState(searchParams.get("search") || "");

  return (
    <Suspense>
      <PanelBodyHeader
        title="لیست درخواست ها"
        breadcrumb={
          <>
            <Link href="/dashboard">پنل کاربری</Link> /{" "}
            <Link href="/dashboard/estate-request">لیست درخواست های ملک</Link>
          </>
        }
        className="gap-y-5"
        childrenClassName="max-sm:mr-0 max-sm:w-full">
        <div className="relative h-14">
          <input
            type="text"
            placeholder="جستجو در درخواست‌ها..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                searchQueries(["search"], [search]);
              }
            }}
            className="h-full w-full rounded-full border border-gray-200 bg-white py-3 pl-4 pr-16 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-primary-blue/50"
          />
          <button
            className="absolute bottom-1 right-1 top-1 flex size-12 items-center justify-center rounded-full bg-primary-blue p-2 text-white"
            onClick={() => searchQueries(["search"], [search])}>
            <SearchIcon className="size-6" />
          </button>
        </div>
      </PanelBodyHeader>
      <EstateRequestsContainer />
    </Suspense>
  );
}
