import { type Metadata } from "next";
import React, { Suspense } from "react";

export const metadata: Metadata = {
  title: "فایل ها",
  description: "فایل ها",
};

export default function EstatesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Suspense>{children}</Suspense>;
}
