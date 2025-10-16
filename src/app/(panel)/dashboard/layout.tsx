"use client";

import { Permissions } from "@/permissions/permission.types";
import { useUserInfo } from "@/services/queries/client/auth/useUserInfo";
import PanelBody from "../_components/PanelBody";
import PanelContainer from "../_components/PanelContainer";
import PanelMenu from "../_components/PanelMenu";
import { menuData } from "./_components/routes";
import { redirect } from "next/navigation";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { userInfo } = useUserInfo();

  if (userInfo?.data?.data.accessPerms.includes(Permissions.USER)) {
    redirect("/user-panel");

    return null;
  }
  return (
    <main className="min-h-dvh bg-admin-bg">
      <PanelContainer>
        <PanelMenu menuData={menuData} profileUrl="/dashboard/profile" />
        <PanelBody>{children}</PanelBody>
      </PanelContainer>
    </main>
  );
}
