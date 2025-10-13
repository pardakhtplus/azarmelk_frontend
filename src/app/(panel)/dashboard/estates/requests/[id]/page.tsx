import { type Metadata } from "next";
import { Suspense } from "react";
import RequestContainer from "./_components/RequestContainer";

export const metadata: Metadata = {
  title: "درخواست",
  description: "درخواست",
};

export default function RequestPage() {
  return (
    <Suspense>
      <RequestContainer />
    </Suspense>
  );
}
