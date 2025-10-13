import { type Metadata } from "next";
import ProfileContainer from "./_components/ProfileContainer";

export const metadata: Metadata = {
  title: "پروفایل",
  description: "پروفایل",
};

export default function ProfilePage() {
  return <ProfileContainer />;
}
