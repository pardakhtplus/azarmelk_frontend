import { type Metadata } from "next";
import { Suspense } from "react";
import UserContainer from "./_components/UserContainer";

export const metadata: Metadata = {
  title: "کاربر",
  description: "کاربر",
};

export default function UserPage() {
  return (
    <Suspense>
      <UserContainer />
    </Suspense>
  );
}
