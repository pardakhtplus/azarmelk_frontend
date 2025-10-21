import {
  IClockRotateLeft,
  IEllipsisVerticalRegular,
  IEye,
  INotes,
  IPencil,
} from "@/components/Icons";
import { ESTATE_ARCHIVE_STATUS, ESTATE_STATUS } from "@/enums";
import { cn } from "@/lib/utils";
import { Permissions } from "@/permissions/permission.types";
import useCreateRequest from "@/services/mutations/admin/estate/useCreateRequest";
import useEditStatus from "@/services/mutations/admin/estate/useEditStatus";
import { useUserInfo } from "@/services/queries/client/auth/useUserInfo";
import { REQUEST_TYPE } from "@/types/admin/estate/enum";
import { type TEstate } from "@/types/types";
import { useQueryClient } from "@tanstack/react-query";
import {
  ArchiveIcon,
  ArchiveXIcon,
  ArrowUpFromLineIcon,
  BarChartIcon,
  BellIcon,
  EyeIcon,
  EyeOffIcon,
  FolderPlusIcon,
  TrashIcon,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import toast from "react-hot-toast";
import { useOnClickOutside } from "usehooks-ts";
import AddToLandingModal from "./AddToLandingModal";
import CompletionStatusModal from "./CompletionStatusModal";
import EstateLogModal from "./EstateLogModal";
import EstateNoteListModal from "./EstateNoteListModal";
import ReminderListModal from "@/components/modules/reminder/ReminderListModal";
import StatusNotificationModal from "./StatusNotificationModal";
import { REMINDER_CONTENT } from "@/components/modules/reminder/sectionUtils";

export default function EstateActions({
  estate,
  className,
  menuClassName,
  containerClassName,
  title,
  status,
  archiveStatus,
  isLastRow = false,
  isTableView = true,
  isOneToLast,
  isUserPanel,
}: {
  estate: TEstate;
  className?: string;
  menuClassName?: string;
  containerClassName?: string;
  title?: string;
  status?: ESTATE_STATUS;
  archiveStatus?: ESTATE_ARCHIVE_STATUS;
  isLastRow?: boolean;
  isOneToLast?: boolean;
  isTableView?: boolean;
  isUserPanel?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [isLogsOpen, setIsLogsOpen] = useState(false);
  const [isLandingModalOpen, setIsLandingModalOpen] = useState(false);
  const [isCompletionModalOpen, setIsCompletionModalOpen] = useState(false);
  const [isRemindersOpen, setIsRemindersOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState<{
    top?: number | undefined;
    left?: number | undefined;
  }>({
    top: undefined,
    left: undefined,
  });
  const ref = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const { userInfo } = useUserInfo();

  const { editStatus } = useEditStatus();
  const { createRequest } = useCreateRequest();
  const queryClient = useQueryClient();

  const isEstateManager =
    userInfo?.data?.data.accessPerms.includes(Permissions.SUPER_USER) ||
    userInfo?.data?.data.accessPerms.includes(Permissions.OWNER) ||
    userInfo?.data?.data.accessPerms.includes(Permissions.MANAGE_ESTATE);
  const isAdviser = estate.adviser?.id === userInfo?.data?.data.id;
  const isHighPermission =
    userInfo?.data?.data.accessPerms.includes(Permissions.SUPER_USER) ||
    userInfo?.data?.data.accessPerms.includes(Permissions.OWNER);

  const isPublish = status === ESTATE_STATUS.PUBLISH;
  const isPending = status === ESTATE_STATUS.PENDING;
  const isArchive = archiveStatus === ESTATE_ARCHIVE_STATUS.ARCHIVE;
  const isDelete = archiveStatus === ESTATE_ARCHIVE_STATUS.DELETE;

  const requestDeleteHandler = async (data: {
    title?: string;
    description?: string;
    contractEndTime?: string;
  }) => {
    if (!data.title || !data.description) {
      toast.error("عنوان و توضیحات حذف نمیتوانند خالی باشند");
      return false;
    }

    const res = await createRequest.mutateAsync({
      estateId: estate.id,
      title: data.title,
      description: data.description,
      ...(data.contractEndTime && {
        contractEndTime: data.contractEndTime,
      }),
      estateStatus: ESTATE_STATUS.PENDING,
      type: REQUEST_TYPE.DELETE,
    });

    if (!res) return false;

    queryClient.invalidateQueries({ queryKey: ["createdEstateList"] });
    queryClient.invalidateQueries({ queryKey: ["estateList"] });

    return true;
  };

  const requestUnDeleteHandler = async () => {
    const res = await createRequest.mutateAsync({
      estateId: estate.id,
      estateStatus: ESTATE_STATUS.PUBLISH,
      type: REQUEST_TYPE.UNDELETE,
    });

    if (!res) return false;

    queryClient.invalidateQueries({ queryKey: ["createdEstateList"] });
    queryClient.invalidateQueries({ queryKey: ["estateList"] });

    return true;
  };

  const requestArchiveHandler = async (data: {
    title?: string;
    description?: string;
    contractEndTime?: string;
  }) => {
    if (!data.title || !data.description) {
      toast.error("عنوان و توضیحات بایگانی نمیتوانند خالی باشند");
      return false;
    }

    const res = await createRequest.mutateAsync({
      estateId: estate.id,
      title: data.title || "",
      description: data.description || "",
      ...(data.contractEndTime && {
        contractEndTime: data.contractEndTime,
      }),
      type: REQUEST_TYPE.ARCHIVE,
      estateStatus: ESTATE_STATUS.PENDING,
    });

    if (!res) return false;

    queryClient.invalidateQueries({ queryKey: ["createdEstateList"] });
    queryClient.invalidateQueries({ queryKey: ["estateList"] });

    return true;
  };

  const requestUnarchiveHandler = async () => {
    const res = await createRequest.mutateAsync({
      estateId: estate.id,
      estateStatus: ESTATE_STATUS.PUBLISH,
      type: REQUEST_TYPE.UNARCHIVE,
    });

    if (!res) return false;

    queryClient.invalidateQueries({ queryKey: ["createdEstateList"] });
    queryClient.invalidateQueries({ queryKey: ["estateList"] });

    return true;
  };

  const editStatusHandler = async (data: { status: ESTATE_STATUS }) => {
    const res = await editStatus.mutateAsync({
      params: {
        estateId: estate.id,
        status: data.status,
      },
    });

    if (!res) return false;

    queryClient.invalidateQueries({ queryKey: ["estateList"] });
    queryClient.invalidateQueries({ queryKey: ["createdEstateList"] });

    return true;
  };

  // Close menu when clicking outside
  useOnClickOutside(menuRef as unknown as React.RefObject<HTMLElement>, () => {
    setOpen(false);
  });

  useEffect(() => setIsClient(true), []);

  // Close menu on scroll
  useEffect(() => {
    if (open) {
      const handleScroll = () => {
        setOpen(false);
      };

      window.addEventListener("scroll", handleScroll, { passive: true });
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [open]);

  // Calculate menu position when opening
  const handleToggleMenu = () => {
    if (!open && ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const scrollLeft =
        window.pageXOffset || document.documentElement.scrollLeft;

      let top, left;

      if (isTableView) {
        if (isOneToLast) {
          top = rect.top - 100;
          left = rect.left + scrollLeft - 176;
        } else if (isLastRow) {
          top = rect.top - 200;
          left = rect.left + scrollLeft - 176;
        } else {
          top = rect.bottom - rect.height;
          left = rect.left + scrollLeft - 176;
        }
      } else {
        top = rect.bottom + scrollTop;
        left = rect.left + scrollLeft + rect.width;
      }

      setMenuPosition({ top, left });
    }
    setOpen(!open);
  };

  if (!isClient) return null;

  return (
    <>
      <div
        className={cn("relative inline-block", containerClassName)}
        ref={ref}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}>
        <button
          className={cn(
            "flex items-center justify-center rounded-md bg-neutral-100 p-1 transition-all hover:bg-neutral-200",
            className,
            open && "bg-neutral-200",
          )}
          onClick={(e) => {
            e.stopPropagation();
            handleToggleMenu();
          }}
          title="گزینه‌های بیشتر">
          <IEllipsisVerticalRegular className="size-5 shrink-0" />
        </button>
      </div>

      {/* Portal for dropdown menu */}
      {createPortal(
        <div
          ref={menuRef}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
          className={cn(
            "invisible fixed z-50 w-48 rounded-md border border-gray-200 bg-white p-1 opacity-0 shadow-lg",
            menuClassName,
            open && "visible opacity-100",
          )}
          style={{
            top: menuPosition.top,
            left: menuPosition.left,
          }}>
          {isEstateManager ||
            isAdviser ||
            (isPublish && (
              <Link
                href={`/estates/${estate.id}`}
                className="flex w-full items-center gap-x-2 rounded-md py-2 pr-3 text-right text-sm text-primary-blue transition-colors hover:bg-primary-blue/5"
                onClick={() => setOpen(false)}>
                <IEye className="size-[18px]" />
                <span>مشاهده</span>
              </Link>
            ))}
          {isDelete || isArchive || isUserPanel ? null : isEstateManager &&
            isPending ? (
            <>
              <StatusNotificationModal
                title="فعال کردن"
                description="آیا از فعال کردن این فایل مطمئن هستید؟"
                className="flex w-full items-center gap-x-2 rounded-md py-2 pr-3 text-right text-sm text-primary-green transition-colors hover:bg-primary-green/10"
                aria-label="accept-estate"
                actionName="تایید"
                actionClassName="text-white bg-primary-green"
                onSubmit={async () => {
                  return await editStatusHandler({
                    status: ESTATE_STATUS.PUBLISH,
                  });
                }}>
                <EyeIcon className="size-[19px]" strokeWidth={2.2} />
                <span>فعال کردن</span>
              </StatusNotificationModal>
              {/* <StatusNotificationModal
                title="حذف"
                description="آیا از حذف این فایل مطمئن هستید؟"
                className="flex w-full items-center gap-x-2 rounded-md pr-3 py-2 text-right text-sm text-red transition-colors hover:bg-red/10"
                aria-label="delete-estate"
                actionName="حذف"
                actionClassName="text-white bg-red"
                onSubmit={async (title, description, file) => {
                  return await requestDeleteHandler({
                    title: title || "",
                    description: description || "",
                    file: file?.[0],
                  });
                }}
                titleLabel="توضیحات حذف">
                <TrashIcon className="size-[19px]" strokeWidth={2.2} />
                <span>حذف</span>
              </StatusNotificationModal> */}
            </>
          ) : isEstateManager ? (
            <StatusNotificationModal
              title="غیر فعال کردن آگهی"
              description="آیا از غیر فعال کردن آگهی این فایل مطمئن هستید؟"
              className="flex w-full items-center gap-x-2 rounded-md py-2 pr-3 text-right text-sm text-red transition-colors hover:bg-red/10"
              aria-label="accept-estate"
              actionName="تایید"
              actionClassName="text-white bg-red"
              onSubmit={async () => {
                return await editStatusHandler({
                  status: ESTATE_STATUS.PENDING,
                });
              }}>
              <EyeOffIcon className="size-[19px]" strokeWidth={2.2} />
              <span>غیر فعال کردن آگهی</span>
            </StatusNotificationModal>
          ) : null}

          {!isArchive && !isDelete && !isUserPanel ? (
            isEstateManager || isAdviser ? (
              <>
                <StatusNotificationModal
                  title="بایگانی فایل"
                  description="آیا از بایگانی این فایل مطمئن هستید؟"
                  className="flex w-full items-center gap-x-2 rounded-md py-2 pr-3 text-right text-sm text-primary-green transition-colors hover:bg-primary-green/10"
                  aria-label="archive-estate"
                  actionName="بایگانی"
                  actionClassName="text-white bg-primary-green"
                  onSubmit={async (title, description) => {
                    return await requestArchiveHandler({
                      title: title || "",
                      description: description || "",
                    });
                  }}
                  isHaveTitle
                  titleLabel="عنوان بایگانی"
                  isHaveDescription
                  descriptionLabel="توضیحات بایگانی">
                  <ArchiveIcon className="size-[19px]" strokeWidth={2.2} />
                  <span>بایگانی فایل</span>
                </StatusNotificationModal>
                <StatusNotificationModal
                  title="حذف فایل"
                  description="آیا از حذف این فایل مطمئن هستید؟"
                  className="flex w-full items-center gap-x-2 rounded-md py-2 pr-3 text-right text-sm text-red transition-colors hover:bg-red/10"
                  aria-label="delete-estate"
                  actionName="حذف"
                  actionClassName="text-white bg-red"
                  onSubmit={async (title, description) => {
                    return await requestDeleteHandler({
                      title: title || "",
                      description: description || "",
                    });
                  }}
                  titleLabel="عنوان حذف"
                  isHaveDescription
                  isHaveTitle
                  descriptionLabel="توضیحات حذف">
                  <TrashIcon className="size-[19px]" strokeWidth={2.2} />
                  <span>حذف فایل</span>
                </StatusNotificationModal>
              </>
            ) : (
              <>
                <StatusNotificationModal
                  title="درخواست بایگانی"
                  description="آیا از درخواست بایگانی این فایل مطمئن هستید؟"
                  className="flex w-full items-center gap-x-2 rounded-md py-2 pr-3 text-right text-sm text-primary-green transition-colors hover:bg-primary-green/10"
                  aria-label="request-archive-estate"
                  actionName="درخواست"
                  actionClassName="text-white bg-primary-green"
                  onSubmit={async (title, description) => {
                    return await requestArchiveHandler({
                      title: title || "",
                      description: description || "",
                    });
                  }}
                  isHaveTitle
                  titleLabel="عنوان بایگانی"
                  isHaveDescription
                  descriptionLabel="توضیحات بایگانی">
                  <ArchiveIcon className="size-[19px]" strokeWidth={2.2} />
                  <span>درخواست بایگانی</span>
                </StatusNotificationModal>
                <StatusNotificationModal
                  title="درخواست حذف"
                  description="آیا از درخواست حذف این فایل مطمئن هستید؟"
                  className="flex w-full items-center gap-x-2 rounded-md py-2 pr-3 text-right text-sm text-red transition-colors hover:bg-red/10"
                  aria-label="request-delete-estate"
                  actionName="درخواست"
                  actionClassName="text-white bg-red"
                  onSubmit={async (title, description) => {
                    return await requestDeleteHandler({
                      title: title || "",
                      description: description || "",
                    });
                  }}
                  titleLabel="عنوان رد حذف"
                  isHaveDescription
                  isHaveTitle
                  descriptionLabel="توضیحات رد حذف">
                  <TrashIcon className="size-[19px]" strokeWidth={2.2} />
                  <span>درخواست حذف</span>
                </StatusNotificationModal>
              </>
            )
          ) : null}

          {isArchive && !isUserPanel ? (
            isEstateManager ? (
              <>
                <StatusNotificationModal
                  title="خروج از بایگانی"
                  description="آیا از خروج این فایل از بایگانی مطمئن هستید؟"
                  className="flex w-full items-center gap-x-2 rounded-md py-2 pr-3 text-right text-sm text-primary-green transition-colors hover:bg-primary-green/10"
                  aria-label="request-publish-estate"
                  actionName="خروج"
                  actionClassName="text-white bg-primary-green"
                  onSubmit={async () => {
                    return await requestUnarchiveHandler();
                  }}>
                  <ArchiveXIcon className="size-[19px]" strokeWidth={2.2} />
                  <span>خروج از بایگانی</span>
                </StatusNotificationModal>
                {/* {isArchive && (
                  <StatusNotificationModal
                    title="حذف فایل"
                    description="آیا از حذف این فایل مطمئن هستید؟"
                    className="flex w-full items-center gap-x-2 rounded-md pr-3 py-2 text-right text-sm text-red transition-colors hover:bg-red/10"
                    aria-label="delete-estate"
                    actionName="حذف"
                    actionClassName="text-white bg-red"
                    onSubmit={async (title, description) => {
                      return await requestDeleteHandler({
                        title: title || "",
                        description: description || "",
                      });
                    }}
                    titleLabel="توضیحات حذف">
                    <TrashIcon className="size-[19px]" strokeWidth={2.2} />
                    <span>حذف فایل</span>
                  </StatusNotificationModal>
                )} */}
              </>
            ) : (
              <>
                <StatusNotificationModal
                  title="درخواست خروج بایگانی"
                  description="آیا از درخواست خروج این فایل از بایگانی مطمئن هستید؟"
                  className="flex w-full items-center gap-x-2 rounded-md py-2 pr-3 text-right text-sm text-primary-green transition-colors hover:bg-primary-green/10"
                  aria-label="request-publish-estate"
                  actionName="درخواست"
                  actionClassName="text-white bg-primary-green"
                  onSubmit={async () => {
                    return await requestUnarchiveHandler();
                  }}>
                  <ArchiveXIcon className="size-[19px]" strokeWidth={2.2} />
                  <span>درخواست خروج بایگانی</span>
                </StatusNotificationModal>
                {/* {isArchive ? (
                  <>
                    <StatusNotificationModal
                      title="درخواست حذف"
                      description="آیا از درخواست حذف این فایل مطمئن هستید؟"
                      className="flex w-full items-center gap-x-2 rounded-md pr-3 py-2 text-right text-sm text-red transition-colors hover:bg-red/10"
                      aria-label="request-delete-estate"
                      actionName="درخواست"
                      actionClassName="text-white bg-red"
                      onSubmit={async (title, description) => {
                        return await requestArchiveHandler({
                          title: title || "",
                          description: description || "",
                        });
                      }}
                      titleLabel="توضیحات رد حذف">
                      <TrashIcon className="size-[19px]" strokeWidth={2.2} />
                      <span>درخواست حذف</span>
                    </StatusNotificationModal>
                  </>
                ) : null} */}
              </>
            )
          ) : null}

          {isDelete && !isUserPanel ? (
            isEstateManager ? (
              <>
                <StatusNotificationModal
                  title="خروج از حذف"
                  description="آیا از خروج این فایل از حذف مطمئن هستید؟"
                  className="flex w-full items-center gap-x-2 rounded-md py-2 pr-3 text-right text-sm text-primary-green transition-colors hover:bg-primary-green/10"
                  aria-label="request-publish-estate"
                  actionName="خروج"
                  actionClassName="text-white bg-primary-green"
                  onSubmit={async () => {
                    return await requestUnDeleteHandler();
                  }}>
                  <ArrowUpFromLineIcon
                    className="size-[19px]"
                    strokeWidth={2.2}
                  />
                  <span>خروج از حذف</span>
                </StatusNotificationModal>
                {/* {isArchive && (
                  <StatusNotificationModal
                    title="حذف فایل"
                    description="آیا از حذف این فایل مطمئن هستید؟"
                    className="flex w-full items-center gap-x-2 rounded-md pr-3 py-2 text-right text-sm text-red transition-colors hover:bg-red/10"
                    aria-label="delete-estate"
                    actionName="حذف"
                    actionClassName="text-white bg-red"
                    onSubmit={async (title, description) => {
                      return await requestDeleteHandler({
                        title: title || "",
                        description: description || "",
                      });
                    }}
                    titleLabel="توضیحات حذف">
                    <TrashIcon className="size-[19px]" strokeWidth={2.2} />
                    <span>حذف فایل</span>
                  </StatusNotificationModal>
                )} */}
              </>
            ) : (
              <>
                <StatusNotificationModal
                  title="درخواست خروج از حذف"
                  description="آیا از درخواست خروج از حذف این فایل مطمئن هستید؟"
                  className="flex w-full items-center gap-x-2 rounded-md py-2 pr-3 text-right text-sm text-primary-green transition-colors hover:bg-primary-green/10"
                  aria-label="request-publish-estate"
                  actionName="درخواست"
                  actionClassName="text-white bg-primary-green"
                  onSubmit={async () => {
                    return await requestUnDeleteHandler();
                  }}>
                  <ArrowUpFromLineIcon
                    className="size-[19px]"
                    strokeWidth={2.2}
                  />
                  <span>درخواست خروج حذف</span>
                </StatusNotificationModal>
                {/* {isArchive ? (
                  <>
                    <StatusNotificationModal
                      title="درخواست حذف"
                      description="آیا از درخواست حذف این فایل مطمئن هستید؟"
                      className="flex w-full items-center gap-x-2 rounded-md pr-3 py-2 text-right text-sm text-red transition-colors hover:bg-red/10"
                      aria-label="request-delete-estate"
                      actionName="درخواست"
                      actionClassName="text-white bg-red"
                      onSubmit={async (title, description) => {
                        return await requestArchiveHandler({
                          title: title || "",
                          description: description || "",
                        });
                      }}
                      titleLabel="توضیحات رد حذف">
                      <TrashIcon className="size-[19px]" strokeWidth={2.2} />
                      <span>درخواست حذف</span>
                    </StatusNotificationModal>
                  </>
                ) : null} */}
              </>
            )
          ) : null}

          <Link
            href={
              isUserPanel
                ? `/user-panel/estates/edit/${estate.id}?callbackUrl=${window.location.pathname}${window.location.search.replace("&", "%")}`
                : `/dashboard/estates/edit/${estate.id}?callbackUrl=${window.location.pathname}${window.location.search.replace("&", "%")}`
            }
            className="flex w-full items-center gap-x-2 rounded-md py-2 pr-3 text-right text-sm transition-colors hover:bg-gray-100"
            onClick={() => setOpen(false)}>
            <IPencil className="size-[18px]" />
            <span>ویرایش</span>
          </Link>
          {isUserPanel ? null : (
            <>
              <button
                className="flex w-full items-center gap-x-2 rounded-md py-2 pr-3 text-right text-sm transition-colors hover:bg-gray-100"
                onClick={() => {
                  setIsNotesOpen(true);
                  setOpen(false);
                }}>
                <INotes className="size-[18px]" />
                <span>گزارش ها</span>
              </button>
              {isEstateManager && (
                <button
                  className="flex w-full items-center gap-x-2 rounded-md py-2 pr-3 text-right text-sm transition-colors hover:bg-gray-100"
                  onClick={() => {
                    setIsLogsOpen(true);
                    setOpen(false);
                  }}>
                  <IClockRotateLeft className="size-[18px]" />
                  <span>تاریخچه</span>
                </button>
              )}
              {isHighPermission && (
                <button
                  className="flex w-full items-center gap-x-2 rounded-md py-2 pr-3 text-right text-sm transition-colors hover:bg-gray-100"
                  onClick={() => {
                    setIsLandingModalOpen(true);
                    setOpen(false);
                  }}>
                  <FolderPlusIcon className="size-[18px]" />
                  <span>افزودن به لندینگ</span>
                </button>
              )}
              <button
                className="flex w-full items-center gap-x-2 rounded-md py-2 pr-3 text-right text-sm transition-colors hover:bg-gray-100"
                onClick={() => {
                  setIsCompletionModalOpen(true);
                  setOpen(false);
                }}>
                <BarChartIcon className="size-[18px]" />
                <span>وضعیت تکمیل</span>
              </button>
              <button
                className="flex w-full items-center gap-x-2 rounded-md py-2 pr-3 text-right text-sm transition-colors hover:bg-gray-100"
                onClick={() => {
                  setIsRemindersOpen(true);
                  setOpen(false);
                }}>
                <BellIcon className="size-[18px]" />
                <span>یادآورها</span>
              </button>
            </>
          )}
        </div>,
        document.body,
      )}

      {isClient && (
        <>
          <EstateNoteListModal
            isOpen={isNotesOpen}
            onClose={() => setIsNotesOpen(false)}
            estateTitle={title || ""}
            estateId={estate.id}
          />
          <EstateLogModal
            isOpen={isLogsOpen}
            onClose={() => setIsLogsOpen(false)}
            estateTitle={title || ""}
            estateId={estate.id}
          />
          {isHighPermission && (
            <AddToLandingModal
              isOpen={isLandingModalOpen}
              onClose={() => setIsLandingModalOpen(false)}
              estateId={estate.id}
            />
          )}
          <CompletionStatusModal
            isOpen={isCompletionModalOpen}
            onClose={() => setIsCompletionModalOpen(false)}
            estateId={estate.id}
            estateTitle={title || ""}
          />
          <ReminderListModal
            isOpen={isRemindersOpen}
            onClose={() => setIsRemindersOpen(false)}
            contentId={estate.id}
            contentTitle={title || ""}
            contentType={REMINDER_CONTENT.ESTATE}
          />
        </>
      )}
    </>
  );
}
