"use client";

import PanelBodyHeader from "@/app/(panel)/_components/PanelBodyHeader";
import { FeatureFlag, isFeatureEnabled } from "@/config/features";
import { type TCategory } from "@/types/admin/category/types";
import Link from "next/link";
import { Suspense, useLayoutEffect, useState } from "react";
import MutateEstate from "../../../_components/MutateEstate/MutateEstate";
import MutateEstateSkeleton from "../../../_components/MutateEstate/MutateEstateSkeleton";
import SelectCategories from "../../../_components/SelectCategories";
import { useParams } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function EditEstateContainer() {
  const { id } = useParams<{ id: string }>();
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

  useLayoutEffect(() => {
    setSelectedCategories(null);
    setSelectedRegion(null);
  }, []);

  if (!isFeatureEnabled(FeatureFlag.ESTATES)) {
    return null;
  }

  return (
    <>
      {!selectedRegion && !firstRender ? (
        <>
          <PanelBodyHeader
            title="ایجاد فایل"
            breadcrumb={
              <>
                <Link href="/dashboard">داشبورد</Link> /{" "}
                <Link href="/dashboard/estates">فایل ها</Link> /{" "}
                <span>ایجاد فایل</span>
              </>
            }
          />
          <div className="mt-10">
            <p className="mb-3 font-medium">دسته بندی را انتخاب کنید</p>
            <SelectCategories
              onSelect={selectRegionHandler}
              setSelectedRegion={setSelectedRegion}
              defaultCategories={selectedCategories ?? []}
              isEditing
              editId={id}
            />
          </div>
        </>
      ) : (
        <Suspense fallback={<MutateEstateSkeleton />}>
          <MutateEstate
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
