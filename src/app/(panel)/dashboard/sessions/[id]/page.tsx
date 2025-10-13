import { type Metadata } from "next";
import { Suspense } from "react";
import SessionDetailContainer from "./_components/SessionDetailContainer";

export const metadata: Metadata = {
  title: "جلسه",
  description: "جلسه",
};

export default function SessionDetailPage() {
  return (
    <Suspense>
      <SessionDetailContainer />
    </Suspense>
  );
}
