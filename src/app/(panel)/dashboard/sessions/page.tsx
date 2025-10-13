import { type Metadata } from "next";
import { Suspense } from "react";
import SessionsContainer from "./_components/SessionsContainer";

export const metadata: Metadata = {
  title: "جلسات",
  description: "جلسات",
};

export default function SessionsPage() {
  return (
    <Suspense>
      <SessionsContainer />
    </Suspense>
  );
}
