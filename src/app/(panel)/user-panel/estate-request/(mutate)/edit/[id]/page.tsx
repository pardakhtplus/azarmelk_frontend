import { type Metadata } from "next";
import { Suspense } from "react";
import EditEstateRequestContainer from "./_components/EditEstateRequestContainer";

export const metadata: Metadata = {
  title: "ویرایش درخواست ملک",
  description: "ویرایش درخواست ملک",
};

export default function EstateRequestEditPage() {
  return (
    <Suspense>
      <EditEstateRequestContainer />
    </Suspense>
  );
}
