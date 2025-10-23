"use client";

import PanelBodyHeader from "@/app/(panel)/_components/PanelBodyHeader";
import MutateEstate from "@/app/(panel)/dashboard/estates/(mutate)/_components/MutateEstate/MutateEstate";
import MutateEstateSkeleton from "@/app/(panel)/dashboard/estates/(mutate)/_components/MutateEstate/MutateEstateSkeleton";
import SelectCategories from "@/app/(panel)/dashboard/estates/(mutate)/_components/SelectCategories";
import { FeatureFlag, isFeatureEnabled } from "@/config/features";
import { type TCategory } from "@/types/admin/category/types";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Suspense, useState } from "react";

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
            isUserPanel={true}
          />
        </Suspense>
      )}

      {/* <CreateFile /> */}
    </>
  );
}
