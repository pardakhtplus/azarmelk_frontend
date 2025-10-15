"use client";

import PanelBodyHeader from "@/app/(panel)/_components/PanelBodyHeader";
import { IEllipsisVerticalRegular, IPause, IPlay } from "@/components/Icons";
import NotificationModal from "@/components/modules/NotificationModal";
import { FeatureFlag, isFeatureEnabled } from "@/config/features";
import { cn } from "@/lib/utils";
import { canPerform } from "@/permissions/hasPermission";
import useEditUserStatus from "@/services/mutations/admin/users/useEditUserStatus";
import { useGetUser } from "@/services/queries/admin/users/useGetUser";
import { useUserInfo } from "@/services/queries/client/auth/useUserInfo";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useParams } from "next/navigation";
import EditPersonal from "./EditPersonal";
import EditUser from "./EditUser";
import TransferAdvisorButton from "./TransferAdvisorButton";
import ContactHistoryModal from "./ContactHistoryModal";
import { Action, Permissions, Subject } from "@/permissions/permission.types";
import Button from "@/components/modules/buttons/Button";
import { useRef, useState } from "react";
import BorderedButton from "@/components/modules/buttons/BorderedButton";
import { NotebookTabsIcon } from "lucide-react";
import { useOnClickOutside } from "usehooks-ts";

export default function UserContainer() {
  const { id } = useParams();
  const { user } = useGetUser({ id: id as string });
  const { editUserStatus } = useEditUserStatus();
  const queryClient = useQueryClient();
  const { userInfo } = useUserInfo();
  const [isOpenActionModal, setIsOpenActionModal] = useState(false);
  const [isOpenContactHistoryModal, setIsOpenContactHistoryModal] =
    useState(false);
  const actionModalRef = useRef<HTMLDivElement>(null);

  const isSuperUser =
    userInfo.data?.data.accessPerms.includes(Permissions.SUPER_USER) ||
    userInfo.data?.data.accessPerms.includes(Permissions.OWNER);

  useOnClickOutside(
    actionModalRef as unknown as React.RefObject<HTMLDivElement>,
    () => setIsOpenActionModal(false),
  );

  if (!isFeatureEnabled(FeatureFlag.USERS)) {
    return null;
  }

  return (
    <>
      <PanelBodyHeader
        isLoading={user.isLoading}
        title={
          (user.data?.data.firstName || "") +
          " " +
          (user.data?.data.lastName || "")
        }
        breadcrumb={
          <>
            <Link href="/dashboard/users">مدیریت کاربران</Link> /{" "}
            <span className="text-primary-300">
              {user.data?.data.firstName || ""} {user.data?.data.lastName || ""}
            </span>
          </>
        }>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Button
              variant="blue"
              isRounded
              onClick={() => {
                if (!isOpenActionModal) {
                  setIsOpenActionModal(true);
                }
              }}>
              <IEllipsisVerticalRegular className="size-6 text-primary-blue" />
            </Button>
            <div
              ref={actionModalRef}
              className={cn(
                "invisible absolute left-0 top-[calc(100%+4px)] z-20 flex w-52 flex-col gap-y-2.5 rounded-2xl border border-primary-border bg-white p-2.5 opacity-0 shadow-lg transition-all",
                isOpenActionModal && "visible opacity-100",
              )}>
              <BorderedButton
                type="button"
                variant="green"
                className={cn("w-full rounded-xl max-md:!size-11 max-md:!px-0")}
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  setIsOpenActionModal(false);
                  setIsOpenContactHistoryModal(true);
                }}>
                <NotebookTabsIcon className="size-5" />
                <span className="hidden md:block">تاریخچه تماس</span>
              </BorderedButton>
              {isSuperUser && user.data?.data && (
                <TransferAdvisorButton
                  currentAdvisor={{
                    id: id as string,
                    firstName: user.data.data.firstName,
                    lastName: user.data.data.lastName,
                    phoneNumber: user.data.data.phoneNumber,
                    avatar: user.data.data.avatar,
                    _count: {
                      createdEstates: 0, // We'll show the button regardless and let the modal handle empty cases
                    },
                  }}
                  onSuccess={() => {
                    queryClient.invalidateQueries({
                      queryKey: ["admin", "user", id],
                    });
                  }}
                />
              )}

              {/* Existing Activate/Deactivate Button */}
              {canPerform(
                Subject.USERS,
                Action.UPDATE,
                userInfo?.data?.data.accessPerms ?? [],
              ) ? (
                <NotificationModal
                  variant="borderedButton"
                  actionName={
                    user.data?.data.isActive ? "قطع دسترسی" : "فعال کردن"
                  }
                  actionClassName={cn(
                    "bg-red",
                    !user.data?.data.isActive && "bg-primary-green",
                  )}
                  title={
                    user.data?.data.isActive
                      ? "قطع دسترسی کاربر"
                      : "فعال کردن دسترسی کاربر"
                  }
                  onSubmit={async () => {
                    const res = await editUserStatus.mutateAsync({
                      id: id as string,
                      status: !user.data?.data.isActive,
                    });

                    if (!res) return false;

                    queryClient.invalidateQueries({
                      queryKey: ["admin", "user", id],
                    });

                    return true;
                  }}
                  description={
                    user.data?.data.isActive
                      ? `آیا میخواهید دسترسی "${user.data?.data.firstName} ${user.data?.data.lastName}" را قطع کنید؟`
                      : `آیا میخواهید دسترسی "${user.data?.data.firstName} ${user.data?.data.lastName}" را فعال کنید؟`
                  }
                  className={cn("rounded-xl max-md:!size-11 max-md:!px-0")}
                  colorVariant={user.data?.data.isActive ? "red" : "green"}>
                  {user.data?.data.isActive ? (
                    <IPause className="size-5" />
                  ) : (
                    <IPlay className="size-5" />
                  )}
                  <span className="hidden md:block">
                    {user.data?.data.isActive ? "قطع دسترسی" : "فعال کردن"}
                  </span>
                </NotificationModal>
              ) : null}
            </div>
          </div>
          {/* Transfer Advisor Button - Only for super users for other advisors */}
        </div>
      </PanelBodyHeader>
      <EditUser />
      {isSuperUser ? <EditPersonal /> : null}

      <ContactHistoryModal
        isOpen={isOpenContactHistoryModal}
        onClose={() => setIsOpenContactHistoryModal(false)}
        userId={id as string}
        userName={`${user.data?.data.firstName || ""} ${user.data?.data.lastName || ""}`}
      />
    </>
  );
}
