import { type Metadata } from "next";
import ForbiddenContainer from "./_components/ForbiddenContainer";

export const metadata: Metadata = {
  title: "403 - دسترسی غیرمجاز",
  description: "403 - دسترسی غیرمجاز",
};

export default function ForbiddenPage() {
  return <ForbiddenContainer />;
}
