"use client";

import PanelBodyHeader from "@/app/(panel)/_components/PanelBodyHeader";
import Link from "next/link";
import ManageCategories from "./ManageCategories";

export default function CategoriesContainer() {
  return (
    <>
      <PanelBodyHeader
        title="دسته بندی ها"
        breadcrumb={
          <>
            <Link href="/dashboard">داشبورد</Link> / <span>دسته بندی ها</span>
          </>
        }
      />
      <ManageCategories />
    </>
  );
}
