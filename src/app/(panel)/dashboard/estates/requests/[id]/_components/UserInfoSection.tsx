"use client";

import { Permissions } from "@/permissions/permission.types";
import { useUserInfo } from "@/services/queries/client/auth/useUserInfo";
import { Phone, User } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

interface UserInfoSectionProps {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
  };
  title: string;
  iconColor: string;
  iconBgColor: string;
}

export default function UserInfoSection({
  user,
  title,
  iconColor,
  iconBgColor,
}: UserInfoSectionProps) {
  const { userInfo } = useUserInfo();

  const isAccessToUsers =
    userInfo.data?.data.accessPerms.includes(Permissions.SUPER_USER) ||
    userInfo.data?.data.accessPerms.includes(Permissions.OWNER) ||
    userInfo.data?.data.accessPerms.includes(Permissions.GET_USER) ||
    userInfo.data?.data.accessPerms.includes(Permissions.EDIT_USERS);

  return (
    <div className="rounded-xl bg-blue-50/50 p-3 !pt-4 sm:p-6 sm:!pt-5">
      <h3 className="mb-4 flex items-center gap-3 text-lg font-semibold text-gray-900">
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-lg ${iconBgColor}`}>
          <User className={`h-5 w-5 ${iconColor}`} />
        </div>
        {title}
      </h3>

      <div className="space-y-2 sm:space-y-4">
        <div className="rounded-lg border border-primary-border/30 bg-white p-3 sm:p-4">
          <label className="mb-1.5 block text-sm font-medium text-gray-500">
            نام و نام خانوادگی
          </label>
          <Link
            onClick={(event) => {
              if (!isAccessToUsers) {
                toast.error("شما دسترسی به بخش کاربران را ندارید");
                event.preventDefault();
              }
            }}
            href={`/dashboard/users/${user.id}`}
            className="text-base font-semibold text-gray-900 transition-colors hover:text-primary sm:text-lg">
            {user.firstName} {user.lastName}
          </Link>
        </div>

        <div className="rounded-lg border border-primary-border/30 bg-white p-3 sm:p-4">
          <label className="mb-2 block text-sm font-medium text-gray-500">
            شماره تماس
          </label>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-gray-400" />
            <span className="font-mono text-lg text-gray-900">
              {user.phoneNumber}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
