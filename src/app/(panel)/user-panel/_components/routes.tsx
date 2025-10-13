import {
  IFolderMagnifyingGlassRegular,
  IFolderOpen,
  IUser,
} from "@/components/Icons";
import { isFeatureEnabled } from "@/config/features";
import { type MenuItem } from "../../_components/PanelMenu";

// Define all menu items with their associated feature flags
const allMenuItems: MenuItem[] = [
  {
    title: "پنل کاربری",
    icon: <IUser className="size-5 shrink-0" />,
    href: "/user-panel",
  },
  {
    title: "فایل ها",
    icon: <IFolderOpen className="size-6 shrink-0" />,
    subItems: [
      {
        title: "مدیریت فایل ها",
        href: "/user-panel/estates",
      },
      {
        title: "فایل های آرشیو",
        href: "/user-panel/estates/archive",
      },
      {
        title: "فایل های ذخیره شده",
        href: "/user-panel/estates/saved",
      },
      {
        title: "ایجاد فایل",
        href: "/user-panel/estates/create",
      },
    ],
  },
  {
    title: "درخواست ملک",
    icon: <IFolderMagnifyingGlassRegular className="ml-1 size-5 shrink-0" />,
    subItems: [
      {
        title: "لیست درخواست ها",
        href: "/user-panel/estate-request",
      },
      {
        title: "ایجاد درخواست",
        href: "/user-panel/estate-request/create",
      },
    ],
  },
];

// Filter menu items based on enabled features
export const menuData: MenuItem[] = allMenuItems.filter(
  (item) => !item.feature || isFeatureEnabled(item.feature),
);
