import {
  IGrid2,
  ILayerGroup,
  IUsers,
  IBrowsers,
  ICalendarWeek,
  IFolderOpen,
  IFolderMagnifyingGlassRegular,
} from "@/components/Icons";
import { FeatureFlag, isFeatureEnabled } from "@/config/features";
import { type MenuItem } from "../../_components/PanelMenu";
import { Action, Subject } from "@/permissions/permission.types";

// Define all menu items with their associated feature flags
const allMenuItems: MenuItem[] = [
  {
    title: "داشبورد",
    icon: <IGrid2 className="size-5 shrink-0" />,
    href: "/dashboard",
    feature: FeatureFlag.DASHBOARD,
  },
  {
    title: "کاربران",
    icon: <IUsers className="size-5 shrink-0" />,
    href: "/dashboard/users?type=users",
    feature: FeatureFlag.USERS,
    startsWith: true,
    subject: Subject.USERS,
  },
  {
    title: "فایل ها",
    icon: <IFolderOpen className="size-6 shrink-0" />,
    feature: FeatureFlag.ESTATES,
    subject: Subject.ESTATES,
    subItems: [
      {
        title: "مدیریت فایل ها",
        href: "/dashboard/estates",
        // subject: Subject.ESTATES,
        // action: Action.MANAGE,
      },
      {
        title: "فایل های من",
        href: "/dashboard/estates/manage-estates",
      },
      {
        title: "فایل های آرشیو",
        href: "/dashboard/estates/archive",
      },
      {
        title: "درخواست ها",
        href: "/dashboard/estates/requests",
        action: Action.READ,
        subject: Subject.ESTATES,
        startsWith: true,
      },
      {
        title: "ایجاد فایل",
        href: "/dashboard/estates/create",
        action: Action.CREATE,
        subject: Subject.ESTATES,
      },
    ],
  },
  {
    title: "دسته بندی ها",
    icon: <ILayerGroup className="size-5 shrink-0" />,
    href: "/dashboard/categories",
    feature: FeatureFlag.CATEGORIES,
    subject: Subject.CATEGORIES,
  },
  {
    title: "لندینگ ها",
    icon: <IBrowsers className="size-5 shrink-0" />,
    href: "/dashboard/landings",
    feature: FeatureFlag.LANDINGS,
    subject: Subject.LANDINGS,
  },
  {
    title: "جلسات",
    icon: <ICalendarWeek className="size-5 shrink-0" />,
    href: "/dashboard/sessions",
    feature: FeatureFlag.SESSIONS,
    startsWith: true,
    subject: Subject.SESSIONS,
    action: Action.READ,
  },
  {
    title: "درخواست های ملک",
    icon: <IFolderMagnifyingGlassRegular className="size-5 shrink-0" />,
    href: "/dashboard/estate-request",
    feature: FeatureFlag.ESTATES,
    startsWith: true,
    subject: Subject.ESTATES,
    action: Action.MANAGE,
  },
];

// Filter menu items based on enabled features
export const menuData: MenuItem[] = allMenuItems.filter(
  (item) => !item.feature || isFeatureEnabled(item.feature),
);
