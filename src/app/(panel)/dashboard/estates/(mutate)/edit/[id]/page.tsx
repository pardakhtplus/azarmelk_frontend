import { type Metadata } from "next";
import { Suspense } from "react";
import EditEstateContainer from "./_components/EditEstateContainer";

export const metadata: Metadata = {
  title: "ویرایش فایل",
  description: "ویرایش فایل",
};

export const dynamic = "force-dynamic";

export default function EstateCreatePage() {
  return (
    <Suspense>
      <EditEstateContainer />
    </Suspense>
  );
}
