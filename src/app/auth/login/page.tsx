import AuthContainer from "./_components/AuthContainer";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "ورود / عضویت",
  description: "ورود / عضویت",
};

export default function LoginPage() {
  return <AuthContainer />;
}
