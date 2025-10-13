import { type Metadata } from "next";
import { Suspense } from "react";
import RequestsContainer from "./_components/RequestsContainer";

export const metadata: Metadata = {
  title: "درخواست ها",
  description: "درخواست ها",
};

export default function RequestsPage() {
  return (
    <Suspense>
      <RequestsContainer />
    </Suspense>
  );
}
