import { FeatureFlag, isFeatureEnabled } from "@/config/features";
import { type Metadata } from "next";
import { notFound } from "next/navigation";
import CategoriesContainer from "./_components/CategoriesContainer";

export const metadata: Metadata = {
  title: "دسته بندی ها",
  description: "دسته بندی ها",
};

export default function CategoriesPage() {
  // If the CATEGORIES feature is disabled, return 404
  if (!isFeatureEnabled(FeatureFlag.CATEGORIES)) {
    notFound();
  }

  return <CategoriesContainer />;
}
