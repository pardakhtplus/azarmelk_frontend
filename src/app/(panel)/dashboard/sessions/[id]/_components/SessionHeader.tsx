import PanelBodyHeader from "@/app/(panel)/_components/PanelBodyHeader";
import { IPenToSquare } from "@/components/Icons";
import Button from "@/components/modules/buttons/Button";
import NotificationModal from "@/components/modules/NotificationModal";
import useEditSessionStatus from "@/services/mutations/admin/session/useEditSessionStatus";
import { SESSION_STATUS } from "@/types/admin/session/enum";
import { BanIcon, CheckIcon, XIcon } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import type { TSession } from "@/types/admin/session/type";
import { useUserInfo } from "@/services/queries/client/auth/useUserInfo";

interface SessionHeaderProps {
  isLoading: boolean;
  title: string;
  breadcrumb: React.ReactNode;
  onEdit?: () => void;
  showApprove: boolean;
  showReject: boolean;
  showCancel: boolean;
  showEdit: boolean;
  children?: React.ReactNode;
  session: TSession;
  canManageSession: boolean;
}

export default function SessionHeader({
  isLoading,
  title,
  breadcrumb,
  onEdit,
  showApprove,
  showReject,
  showCancel,
  children,
  session,
  canManageSession,
}: SessionHeaderProps) {
  const { editSessionStatus } = useEditSessionStatus();
  const queryClient = useQueryClient();
  const { userInfo } = useUserInfo();
  return (
    <PanelBodyHeader
      isLoading={isLoading}
      title={title}
      breadcrumb={breadcrumb}>
      <div className="flex items-center gap-2">
        {showApprove && canManageSession && (
          <NotificationModal
            onSubmit={async (note) => {
              const res = await editSessionStatus.mutateAsync({
                id: session.id,
                status: SESSION_STATUS.CONFIRMED,
                note: note,
              });

              if (!res) return false;

              queryClient.invalidateQueries({
                queryKey: ["session", session.id],
              });

              queryClient.invalidateQueries({
                queryKey: ["sessionList"],
              });

              queryClient.invalidateQueries({
                queryKey: ["sessionCountList"],
              });

              queryClient.invalidateQueries({
                queryKey: ["sessionCountCreatedList"],
              });

              queryClient.invalidateQueries({
                queryKey: ["sessionCreatedList"],
              });

              return true;
            }}
            title="تایید جلسه"
            description={`آیا از تایید کردن جلسه "${session.title}" مطمئن هستید؟`}
            isHaveNote
            noteTitle="یادداشت"
            actionName="تایید جلسه"
            actionClassName="bg-primary-green"
            variant="button"
            colorVariant="green"
            className="max-md:!size-11 max-md:!px-0">
            <CheckIcon className="size-[18px]" />
            <span className="hidden md:block">تایید جلسه</span>
          </NotificationModal>
        )}
        {showReject && canManageSession && (
          <NotificationModal
            onSubmit={async (note) => {
              const res = await editSessionStatus.mutateAsync({
                id: session.id,
                status: SESSION_STATUS.REJECTED,
                note: note,
              });

              if (!res) return false;

              queryClient.invalidateQueries({
                queryKey: ["session", session.id],
              });

              queryClient.invalidateQueries({
                queryKey: ["sessionList"],
              });

              queryClient.invalidateQueries({
                queryKey: ["sessionCountList"],
              });

              queryClient.invalidateQueries({
                queryKey: ["sessionCountCreatedList"],
              });

              queryClient.invalidateQueries({
                queryKey: ["sessionCreatedList"],
              });

              return true;
            }}
            title="رد جلسه"
            description={`آیا از رد کردن جلسه "${session.title}" مطمئن هستید؟`}
            isHaveNote
            noteTitle="یادداشت"
            actionName="رد جلسه"
            actionClassName="bg-primary-red"
            variant="button"
            colorVariant="red"
            className="max-md:!size-11 max-md:!px-0">
            <XIcon className="size-[18px]" />
            <span className="hidden md:block">رد جلسه</span>
          </NotificationModal>
        )}
        {showCancel && canManageSession && (
          <NotificationModal
            onSubmit={async (note) => {
              const res = await editSessionStatus.mutateAsync({
                id: session.id,
                status: SESSION_STATUS.CANCELED,
                note: note,
              });

              if (!res) return false;

              queryClient.invalidateQueries({
                queryKey: ["session", session.id],
              });

              queryClient.invalidateQueries({
                queryKey: ["sessionList"],
              });

              queryClient.invalidateQueries({
                queryKey: ["sessionCountList"],
              });

              queryClient.invalidateQueries({
                queryKey: ["sessionCreatedList"],
              });

              queryClient.invalidateQueries({
                queryKey: ["sessionCountCreatedList"],
              });

              return true;
            }}
            title="لغو جلسه"
            description={`آیا از لغو جلسه "${session.title}" مطمئن هستید؟`}
            isHaveNote
            noteTitle="یادداشت"
            actionName="لغو جلسه"
            actionClassName="bg-primary-red"
            variant="button"
            colorVariant="red"
            className="max-md:!size-11 max-md:!px-0">
            <BanIcon className="size-[18px]" />
            <span className="hidden md:block">لغو جلسه</span>
          </NotificationModal>
        )}
        {(canManageSession ||
          (session.creator.id === userInfo?.data?.data.id &&
            session.status === SESSION_STATUS.PENDING)) && (
          <Button
            variant="blue"
            onClick={onEdit}
            className="flex items-center gap-x-1 !px-7 max-md:!size-11 max-md:!px-0">
            <span className="hidden md:block">ویرایش</span>
            <IPenToSquare className="size-4 md:size-5" />
          </Button>
        )}
        {children}
      </div>
    </PanelBodyHeader>
  );
}
