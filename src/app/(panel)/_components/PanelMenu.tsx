"use client";

import { type FeatureFlag } from "@/config/features";
import { canPerform } from "@/permissions/hasPermission";
import {
  Action,
  Permissions,
  type Subject,
} from "@/permissions/permission.types";
import { useUserInfo } from "@/services/queries/client/auth/useUserInfo";
import { usePanelMenuStore } from "@/stores/panelMenuStore";
import { useEffect, useState } from "react";
import PanelMenuDesktop from "./PanelMenuDesktop";
import PanelMenuMobile from "./PanelMenuMobile";

export interface MenuItem {
  title: string;
  icon: React.ReactNode;
  href?: string;
  subItems?: {
    title: string;
    href: string;
    action?: Action;
    subject?: Subject;
    startsWith?: boolean;
  }[];
  feature?: FeatureFlag;
  startsWith?: boolean;
  subject?: Subject;
  action?: Action;
  hideForAdmins?: boolean;
}

export default function PanelMenu({
  menuData,
  profileUrl,
}: {
  menuData: MenuItem[];
  profileUrl: string;
}) {
  const { userInfo } = useUserInfo();
  const [openedMenuTitle, setOpenedMenuTitle] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const { isMinimized, setIsMinimized, toggleMinimized } = usePanelMenuStore();

  const canCreateEstate =
    userInfo.data?.data.accessPerms.includes(Permissions.CREATE_ESTATE) ||
    userInfo.data?.data.accessPerms.includes(Permissions.MANAGE_ESTATE) ||
    userInfo.data?.data.accessPerms.includes(Permissions.SUPER_USER) ||
    userInfo.data?.data.accessPerms.includes(Permissions.OWNER);

  const menuItemsByPermission = menuData
    .filter((item) => {
      if (item.hideForAdmins) {
        return !canCreateEstate;
      }
      return (
        !item.subject ||
        canPerform(
          item.subject,
          item.action ?? Action.READ,
          userInfo?.data?.data.accessPerms ?? [],
        )
      );
    })
    .map((item) => {
      if (item.subItems) {
        return {
          ...item,
          subItems: item.subItems.filter(
            (subItem) =>
              !subItem.subject ||
              canPerform(
                subItem.subject,
                subItem.action ?? Action.READ,
                userInfo?.data?.data.accessPerms ?? [],
              ),
          ),
        };
      }
      return item;
    })
    .map((item) => {
      if (item.startsWith) {
        return {
          ...item,
          subItems: item.subItems?.length ? item.subItems : undefined,
        };
      }
      return item;
    });

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const handleMinimizeToggle = () => {
    toggleMinimized();
  };

  if (!isHydrated) {
    return null;
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <PanelMenuDesktop
        menuData={menuItemsByPermission}
        openedMenuTitle={openedMenuTitle}
        setOpenedMenuTitle={setOpenedMenuTitle}
        isMinimized={isMinimized}
        handleMinimizeToggle={handleMinimizeToggle}
        setIsMinimized={setIsMinimized}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        profileUrl={profileUrl}
      />
      {/* Mobile Drawer */}
      <PanelMenuMobile
        menuData={menuItemsByPermission}
        openedMenuTitle={openedMenuTitle}
        setOpenedMenuTitle={setOpenedMenuTitle}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        profileUrl={profileUrl}
      />
    </>
  );
}
