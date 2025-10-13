import { type Metadata } from "next";
import { Suspense } from "react";
import CreateEstateContainer from "./_components/CreateEstateContainer";

export const metadata: Metadata = {
  title: "ایجاد فایل",
  description: "ایجاد فایل",
};

export default function EstateCreatePage() {
  return (
    <Suspense>
      <CreateEstateContainer />
    </Suspense>
  );
}
