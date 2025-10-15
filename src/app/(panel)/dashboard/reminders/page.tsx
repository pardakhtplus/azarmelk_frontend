import { type Metadata } from "next";
import { Suspense } from "react";
import RemindersContainer from "./_components/RemindersContainer";

export const metadata: Metadata = {
  title: "یادآور ها",
  description: "یادآور ها",
};

export default function RemindersPage() {
  return (
    <Suspense>
      <RemindersContainer />
    </Suspense>
  );
}
