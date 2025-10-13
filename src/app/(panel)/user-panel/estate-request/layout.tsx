import { type Metadata } from "next";
import React, { Suspense } from "react";

export const metadata: Metadata = {
  title: "درخواست ملک",
  description: "درخواست ملک",
};

export default function EstatesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Suspense>{children}</Suspense>;
}
