import { type Metadata } from "next";
import { Suspense } from "react";
import CreateEstateRequestContainer from "./_components/CreateEstateRequestContainer";

export const metadata: Metadata = {
  title: "ایجاد درخواست ملک",
  description: "ایجاد درخواست ملک",
};

export default function EstateRequestCreatePage() {
  return (
    <Suspense>
      <CreateEstateRequestContainer />
    </Suspense>
  );
}
