import { type Metadata } from "next";
import { Suspense } from "react";
import LandingsContainer from "./_components/LandingsContainer";

export const metadata: Metadata = {
  title: "لندینگ ها",
  description: "لندینگ ها",
};

export default function UsersPage() {
  return (
    <Suspense>
      <LandingsContainer />
    </Suspense>
  );
}
