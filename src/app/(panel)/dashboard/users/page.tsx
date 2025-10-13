import { type Metadata } from "next";
import { Suspense } from "react";
import UsersContainer from "./_components/UsersContainer";

export const metadata: Metadata = {
  title: "کاربران",
  description: "کاربران",
};

export default function UsersPage() {
  return (
    <Suspense>
      <UsersContainer />
    </Suspense>
  );
}
