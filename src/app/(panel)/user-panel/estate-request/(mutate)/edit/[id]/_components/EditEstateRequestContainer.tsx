"use client";

import PanelBodyHeader from "@/app/(panel)/_components/PanelBodyHeader";
import { FeatureFlag, isFeatureEnabled } from "@/config/features";
import { type TCategory } from "@/types/admin/category/types";
import Link from "next/link";
import { Suspense, useState } from "react";
import MutateEstateRequest from "../../../_components/MutateEstateRequest/MutateEstateRequest";
import MutateEstateRequestSkeleton from "../../../_components/MutateEstateRequest/MutateEstateRequestSkeleton";
import SelectCategories from "../../../_components/SelectCategories";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function EditEstateRequestContainer() {
  const [selectedCategories, setSelectedCategories] = useState<
    TCategory[] | null
  >(null);
  const [selectedRegion, setSelectedRegion] = useState<TCategory | null>(null);
  const [firstRender, setFirstRender] = useState(true);

  const selectRegionHandler = (
    region: TCategory,
    parentCategory: TCategory[],
  ) => {
    setSelectedRegion(region);
    setSelectedCategories(parentCategory);
  };

  if (!isFeatureEnabled(FeatureFlag.ESTATES)) {
    return null;
  }

  return (
    <>
      {!selectedRegion && !firstRender ? (
        <>
          <PanelBodyHeader
            title="ویرایش درخواست ملک"
            breadcrumb={
              <>
                <Link href="/user-panel">داشبورد</Link> /{" "}
                <Link href="/user-panel/estate-request">درخواست ملک</Link> /{" "}
                <span>ویرایش درخواست ملک</span>
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
            isEditing
            firstRender={firstRender}
            setFirstRender={setFirstRender}
          />
        </Suspense>
      )}

      {/* <CreateFile /> */}
    </>
  );
}
