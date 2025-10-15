"use client";

import PanelBodyHeader from "@/app/(panel)/_components/PanelBodyHeader";
import MutateEstate from "@/app/(panel)/dashboard/estates/(mutate)/_components/MutateEstate/MutateEstate";
import MutateEstateSkeleton from "@/app/(panel)/dashboard/estates/(mutate)/_components/MutateEstate/MutateEstateSkeleton";
import SelectCategories from "@/app/(panel)/dashboard/estates/(mutate)/_components/SelectCategories";
import {
  SELECT_CATEGORY_LEVELS,
  selectCategoryLevels,
} from "@/app/(panel)/dashboard/estates/(mutate)/_components/SelectCategoryLevels";
import { FeatureFlag, isFeatureEnabled } from "@/config/features";
import useSearchQueries from "@/hooks/useSearchQueries";
import { type TCategory } from "@/types/admin/category/types";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

export default function CreateEstateContainer() {
  const [selectedCategories, setSelectedCategories] = useState<
    TCategory[] | null
  >(null);
  const [selectedRegion, setSelectedRegion] = useState<TCategory | null>(null);
  const searchQueries = useSearchQueries();
  const searchParams = useSearchParams();

  const selectRegionHandler = (
    region: TCategory,
    parentCategory: TCategory[],
  ) => {
    setSelectedRegion(region);
    setSelectedCategories(parentCategory);

    searchQueries(["selectedCategoriesLevels"], [selectCategoryLevels[5]]);
  };

  useEffect(() => {
    const selectedCategoriesLevels = searchParams.get(
      "selectedCategoriesLevels",
    );
    if (selectedCategoriesLevels !== SELECT_CATEGORY_LEVELS.CREATE_ESTATE) {
      setSelectedRegion(null);
    }
  }, [searchParams]);

  console.log(selectedCategories, "selectedCategories");
  console.log(selectedRegion, "selectedRegion");

  if (!isFeatureEnabled(FeatureFlag.ESTATES)) {
    return null;
  }

  return (
    <>
      {!selectedRegion ? (
        <>
          <PanelBodyHeader
            title="ایجاد فایل"
            breadcrumb={
              <>
                <Link href="/user-panel">پنل کاربری</Link> /{" "}
                <Link href="/user-panel/estates">فایل ها</Link> /{" "}
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
              isUserPanel
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
            isUserPanel
          />
        </Suspense>
      )}

      {/* <CreateFile /> */}
    </>
  );
}
