"use client";

import PanelBodyHeader from "@/app/(panel)/_components/PanelBodyHeader";
import { FeatureFlag, isFeatureEnabled } from "@/config/features";
import useSearchQueries from "@/hooks/useSearchQueries";
import { type TCategory } from "@/types/admin/category/types";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import MutateEstateRequest from "../../_components/MutateEstateRequest/MutateEstateRequest";
import MutateEstateRequestSkeleton from "../../_components/MutateEstateRequest/MutateEstateRequestSkeleton";
import SelectCategories from "../../_components/SelectCategories";

export default function CreateEstateRequestContainer() {
  const [selectedCategories, setSelectedCategories] = useState<
    TCategory[] | null
  >(null);
  const [selectedRegion, setSelectedRegion] = useState<TCategory | null>(null);
  const searchQueries = useSearchQueries();
  const searchParams = useSearchParams();

  const isRegionSelected = searchParams.get("isRegionSelected") === "true";

  const selectRegionHandler = (
    region: TCategory,
    parentCategory: TCategory[],
  ) => {
    setSelectedRegion(region);
    setSelectedCategories(parentCategory);
    searchQueries(["isRegionSelected"], ["true"]);
  };

  useEffect(() => {
    if (!isRegionSelected) {
      setSelectedRegion(null);
      setSelectedCategories(null);
    }
  }, [isRegionSelected]);

  useEffect(() => {
    if (!selectedRegion) {
      searchQueries(["isRegionSelected"], []);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRegion]);

  if (!isFeatureEnabled(FeatureFlag.ESTATES)) {
    return null;
  }

  return (
    <>
      {!selectedRegion ? (
        <>
          <PanelBodyHeader
            title="ایجاد درخواست ملک"
            breadcrumb={
              <>
                <Link href="/user-panel">داشبورد</Link> /{" "}
                <Link href="/user-panel/estate-request">درخواست ملک</Link> /{" "}
                <span>ایجاد درخواست ملک</span>
              </>
            }
          />
          <div className="mt-10">
            <p className="mb-3 font-medium">دسته بندی را انتخاب کنید</p>
            <SelectCategories onSelect={selectRegionHandler} />
          </div>
        </>
      ) : (
        <Suspense fallback={<MutateEstateRequestSkeleton />}>
          <MutateEstateRequest
            selectedCategories={selectedCategories ?? []}
            setSelectedCategories={setSelectedCategories}
            setSelectedRegion={setSelectedRegion}
            selectedRegion={selectedRegion}
          />
        </Suspense>
      )}

      {/* <CreateFile /> */}
    </>
  );
}
