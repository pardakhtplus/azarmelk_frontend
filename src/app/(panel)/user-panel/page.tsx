import { type Metadata } from "next";
import UserPanelContainer from "./_components/UserPanelContainer";

export const metadata: Metadata = {
  title: "پنل کاربری",
  description: "پنل کاربری",
};

export default function UserPanelPage() {
  return <UserPanelContainer />;
}
