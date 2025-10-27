"use client";

import BorderedButton from "@/components/modules/buttons/BorderedButton";
import Button from "@/components/modules/buttons/Button";
import Modal from "@/components/modules/Modal";
import {
  cn,
  convertToEnglishNumbers,
  dateType,
  formatNumber,
  unFormatNumber,
} from "@/lib/utils";
import useMutateSession from "@/services/mutations/admin/session/useMutateSession";
import { useSession } from "@/services/queries/admin/session/useSession";
import { SESSION_STATUS } from "@/types/admin/session/enum";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import {
  Calendar as CalendarIcon,
  CircleAlertIcon,
  Clock,
  Edit2,
} from "lucide-react";
import { useEffect, useState } from "react";
import DateObject from "react-date-object";
import gregorian from "react-date-object/calendars/gregorian";
import persian from "react-date-object/calendars/persian";
import gregorian_en from "react-date-object/locales/gregorian_en";
import persian_fa from "react-date-object/locales/persian_fa";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import ApplicantInfoForm from "./ApplicantInfoForm";
import EstatePickerButton from "./EstatePickerButton";
import EstateSelector from "./EstateSelector";
import OwnerPricesForm from "./OwnerPricesForm";
import QuestionsSection from "./QuestionsSection";
import SessionBasicInfoForm from "./SessionBasicInfoForm";
import SessionDateTimeModal from "./SessionDateTimeModal";
import SessionUsersList from "./SessionUsersList";
import UserSelector, { type TSelectedUser } from "./UserSelector";

const staticSessionTimes = [
  {
    id: 1,
    title: "ساعت 10 تا 12",
    startTime: 10,
    endTime: 12,
  },
  {
    id: 2,
    title: "ساعت 12 تا 14",
    startTime: 12,
    endTime: 14,
  },
  {
    id: 3,
    title: "ساعت 17 تا 19",
    startTime: 17,
    endTime: 19,
  },
  {
    id: 4,
    title: "ساعت 19 تا 21",
    startTime: 19,
    endTime: 21,
  },
];

const formSchema = z.object({
  title: z.string().min(1, {
    message: "عنوان باید حداقل ۳ حرف باشد!",
  }),
  users: z.array(
    z.object({
      userId: z.string(),
      percent: z.number(),
      firstName: z.string(),
      lastName: z.string(),
      avatar: z
        .object({
          url: z.string().optional(),
        })
        .optional(),
    }),
  ),
  startSession: z.any(),
  room: z.number(),
  sellerName: z.string(),
  estate: z
    .object({
      id: z.string().optional(),
      title: z.string().optional(),
      estateCode: z.any().optional(),
      thumbnailUrl: z.string().optional(),
    })
    .optional()
    .nullable(),
  paymentMethod: z.string(),
  ownerPrice: z.string(),
  ownerFinalPrice: z.string(),
  applicantName: z.string(),
  applicantPhoneNumber: z.string(),
  applicantBudget: z.string(),
  applicantFinalBudget: z.string(),
  attractApplicantsMethod: z.string(),
  qOne: z.string(),
  qTwo: z.string(),
  qThree: z.boolean(),
  qFour: z.boolean(),
});

export type MutateSessionForm = z.infer<typeof formSchema>;

export default function MutateSession({
  isOpenModal,
  setIsOpenModal,
  startSession,
  room,
  isEditing,
  defaultSessionId,
}: {
  isOpenModal: boolean;
  setIsOpenModal: (isOpen: boolean) => void;
  startSession: DateObject;
  room: number;
  isEditing?: boolean;
  defaultSessionId?: string;
}) {
  const [isClient, setIsClient] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<TSelectedUser[]>([]);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isEstateModalOpen, setIsEstateModalOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Date and time state
  const [sessionDate, setSessionDate] = useState<DateObject>(startSession);
  const [isDateTimeModalOpen, setIsDateTimeModalOpen] = useState(false);
  const [customTime, setCustomTime] = useState<{
    hour: number;
    minute: number;
    isStaticTime: boolean;
    staticTimeId?: number;
  }>({
    hour: startSession.hour,
    minute: startSession.minute,
    isStaticTime: false,
  });

  const { mutateSession } = useMutateSession();
  const { session } = useSession({
    id: defaultSessionId || "",
    enabled: isEditing && isOpenModal,
  });

  const defaultSession = session.data?.data;

  // Initialize session date from default session if editing
  useEffect(() => {
    if (isEditing && defaultSession?.startSession) {
      const defaultDate = new DateObject({
        date: new Date(defaultSession.startSession),
        calendar: persian,
        locale: persian_fa,
      });

      // Check if this is a static time
      const hour = defaultDate.hour;
      const minute = defaultDate.minute;
      const staticTime = staticSessionTimes.find(
        (slot) => slot.startTime === hour && minute === 0,
      );

      setSessionDate(defaultDate);
      setCustomTime({
        hour: defaultDate.hour,
        minute: defaultDate.minute,
        isStaticTime: !!staticTime,
        staticTimeId: staticTime?.id,
      });
    }
  }, [isEditing, defaultSession]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    getValues,
    watch,
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),

    values: {
      room: defaultSession?.room || 0,
      sellerName: defaultSession?.sellerName || "",
      title: defaultSession?.title || "",
      estate: defaultSession?.estate
        ? {
            id: defaultSession?.estate.id || "",
            title: defaultSession?.estate.title || "",
            estateCode: defaultSession?.estate.estateCode || undefined,
            thumbnailUrl: defaultSession?.estate.posterFile?.url || "",
          }
        : undefined,
      paymentMethod: defaultSession?.paymentMethod || "",
      ownerPrice: defaultSession?.ownerPrice
        ? formatNumber(defaultSession?.ownerPrice?.toString() || "")
        : "",
      ownerFinalPrice: defaultSession?.ownerFinalPrice
        ? formatNumber(defaultSession?.ownerFinalPrice?.toString() || "")
        : "",
      applicantName: defaultSession?.applicantName || "",
      applicantPhoneNumber: defaultSession?.applicantPhoneNumber || "",
      applicantBudget: defaultSession?.applicantBudget
        ? formatNumber(defaultSession?.applicantBudget?.toString() || "")
        : "",
      applicantFinalBudget: defaultSession?.applicantFinalBudget
        ? formatNumber(defaultSession?.applicantFinalBudget?.toString() || "")
        : "",
      attractApplicantsMethod: defaultSession?.attractApplicantsMethod || "",
      qOne: defaultSession?.qOne || "",
      qTwo: defaultSession?.qTwo || "",
      qThree: defaultSession?.qThree === "true" ? true : false,
      qFour: defaultSession?.qFour === "true" ? true : false,
      users:
        defaultSession?.users.map((user) => ({
          userId: user.user.id,
          firstName: user.user.firstName,
          lastName: user.user.lastName,
          percent: user.percent,
          avatar: user.user.avatar,
        })) || [],
      startSession: defaultSession?.startSession,
    },
  });

  const addUserToSession = (newUser: TSelectedUser) => {
    if (editingUserId) {
      // Edit existing user
      const updatedUsers = selectedUsers.map((user) =>
        user.userId === editingUserId ? { ...user, ...newUser } : user,
      );

      setSelectedUsers(updatedUsers);
      setValue(
        "users",
        updatedUsers.map((u) => ({
          ...u,
        })),
      );
      setEditingUserId(null);
    } else {
      // Add new user
      const updatedUsers = [...selectedUsers, newUser];
      setSelectedUsers(updatedUsers);

      // Update form value
      setValue(
        "users",
        updatedUsers.map((u) => ({
          ...u,
        })),
      );
    }

    // Reset selection
    setIsUserModalOpen(false);
  };

  const editUser = (userId: string) => {
    const userToEdit = selectedUsers.find((user) => user.userId === userId);
    if (userToEdit) {
      setEditingUserId(userId);
      setIsUserModalOpen(true);
    }
  };

  const removeUser = (userId: string) => {
    const updatedUsers = selectedUsers.filter((user) => user.userId !== userId);
    setSelectedUsers(updatedUsers);

    // Update form value
    setValue(
      "users",
      updatedUsers.map((u) => ({
        ...u,
      })),
    );
  };

  const openAddUserModal = () => {
    setEditingUserId(null);
    setIsUserModalOpen(true);
  };

  // Function to handle date and time update
  const handleDateTimeUpdate = (
    newDate: DateObject,
    newTime: {
      hour: number;
      minute: number;
      isStaticTime: boolean;
      staticTimeId?: number;
    },
  ) => {
    setSessionDate(newDate);
    setCustomTime(newTime);
    setIsDateTimeModalOpen(false);
  };

  async function onSubmit() {
    const values = getValues();

    // Use the updated sessionDate instead of startSession
    const updatedSessionDate = new DateObject(sessionDate);
    updatedSessionDate.setHour(customTime.hour);
    updatedSessionDate.setMinute(customTime.minute);

    const isoDateString = convertToEnglishNumbers(
      updatedSessionDate
        .convert(gregorian, gregorian_en)
        .toUTC()
        .format(dateType),
    );

    let res: any;

    // Calculate endSession from startSession + 2 hours (default)
    const endSessionDate = new DateObject(updatedSessionDate);
    endSessionDate.setHour(customTime.hour + 2);
    // const endSessionIsoString = convertToEnglishNumbers(
    // endSessionDate.convert(gregorian, gregorian_en).toUTC().format(dateType),
    // );

    if (isEditing)
      res = await mutateSession.mutateAsync({
        id: defaultSessionId,
        room: room,
        ...(values.sellerName ? { sellerName: values.sellerName } : {}),
        startSession: isoDateString,
        // endSession: endSessionIsoString,
        title: values.title,
        users: values.users.map((user) => ({
          userId: user.userId,
          percent: user.percent,
        })),
        status: SESSION_STATUS.PENDING,
        ...(values.estate?.id ? { estateId: values.estate.id } : ({} as any)),
        ...(values.paymentMethod
          ? { paymentMethod: values.paymentMethod }
          : {}),
        ...(Number(unFormatNumber(values.ownerPrice))
          ? { ownerPrice: Number(unFormatNumber(values.ownerPrice)) || 0 }
          : {}),
        ...(Number(unFormatNumber(values.ownerFinalPrice))
          ? {
              ownerFinalPrice:
                Number(unFormatNumber(values.ownerFinalPrice)) || 0,
            }
          : {}),
        ...(values.applicantName
          ? { applicantName: values.applicantName }
          : {}),
        ...(values.applicantPhoneNumber
          ? { applicantPhoneNumber: Number(values.applicantPhoneNumber) || 0 }
          : {}),
        ...(Number(unFormatNumber(values.applicantBudget))
          ? {
              applicantBudget:
                Number(unFormatNumber(values.applicantBudget)) || 0,
            }
          : {}),
        ...(Number(unFormatNumber(values.applicantFinalBudget))
          ? {
              applicantFinalBudget:
                Number(unFormatNumber(values.applicantFinalBudget)) || 0,
            }
          : {}),
        ...(values.attractApplicantsMethod
          ? { attractApplicantsMethod: values.attractApplicantsMethod }
          : {}),
        ...(values.qOne ? { qOne: values.qOne } : {}),
        ...(values.qTwo ? { qTwo: values.qTwo } : {}),
        qThree: values.qThree ? true : false,
        qFour: values.qFour ? true : false,
      });
    else
      res = await mutateSession.mutateAsync({
        room: room,
        ...(values.sellerName ? { sellerName: values.sellerName } : {}),
        startSession: isoDateString,
        // endSession: endSessionIsoString,
        title: values.title,
        users: values.users.map((user) => ({
          userId: user.userId,
          percent: user.percent,
        })),
        status: SESSION_STATUS.PENDING,
        ...(values.estate?.id ? { estateId: values.estate.id } : ({} as any)),
        ...(values.paymentMethod
          ? { paymentMethod: values.paymentMethod }
          : {}),
        ...(Number(unFormatNumber(values.ownerPrice))
          ? { ownerPrice: Number(unFormatNumber(values.ownerPrice)) || 0 }
          : {}),
        ...(Number(unFormatNumber(values.ownerFinalPrice))
          ? {
              ownerFinalPrice:
                Number(unFormatNumber(values.ownerFinalPrice)) || 0,
            }
          : {}),
        ...(values.applicantName
          ? { applicantName: values.applicantName }
          : {}),
        ...(values.applicantPhoneNumber
          ? { applicantPhoneNumber: Number(values.applicantPhoneNumber) || 0 }
          : {}),
        ...(Number(unFormatNumber(values.applicantBudget))
          ? {
              applicantBudget:
                Number(unFormatNumber(values.applicantBudget)) || 0,
            }
          : {}),
        ...(Number(unFormatNumber(values.applicantFinalBudget))
          ? {
              applicantFinalBudget:
                Number(unFormatNumber(values.applicantFinalBudget)) || 0,
            }
          : {}),
        ...(values.attractApplicantsMethod
          ? { attractApplicantsMethod: values.attractApplicantsMethod }
          : {}),
        ...(values.qOne ? { qOne: values.qOne } : {}),
        ...(values.qTwo ? { qTwo: values.qTwo } : {}),
        qThree: values.qThree ? true : false,
        qFour: values.qFour ? true : false,
      });

    if (!res) return;

    queryClient.invalidateQueries({
      queryKey: ["sessionList"],
    });

    queryClient.invalidateQueries({
      queryKey: ["session", defaultSessionId],
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

    setIsOpenModal(false);
    reset();
    setSelectedUsers([]);
  }

  useEffect(() => {
    if (isEditing && isOpenModal && defaultSessionId && defaultSession) {
      setSelectedUsers(
        defaultSession.users.map((user) => ({
          firstName: user.user.firstName,
          lastName: user.user.lastName,
          percent: user.percent,
          userId: user.user.id,
          avatar: user.user.avatar,
        })),
      );
    }
  }, [defaultSessionId, isEditing, isOpenModal, defaultSession]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <>
      {createPortal(
        <Modal
          doNotHiddenOverflow
          isOpen={isOpenModal}
          title={
            isEditing
              ? `ویرایش جلسه ${defaultSession?.title}`
              : `افزودن جلسه جدید در ${startSession.format("dddd D MMMM ساعت HH:mm")}`
          }
          classNames={{
            background: "z-50 !py-0 md:!px-4 !px-0 md:!py-4",
            box: "md:!max-w-4xl md:!h-fit !max-w-none !rounded-none md:!rounded-lg !h-full !max-h-none",
            header: "sticky top-0 z-[1] bg-white md:bg-transparent md:static",
          }}
          onCloseModal={() => setIsOpenModal(false)}
          onClickOutside={() => setIsOpenModal(false)}>
          <div
            className={cn(
              "flex flex-col gap-y-3 px-3 py-7 sm:px-6",
              isEditing && "!pt-4",
            )}>
            {/* Warning Banner */}
            <div className="mb-2 flex items-center gap-x-2 rounded-lg border border-yellow-200 bg-yellow-50 px-5 py-4 text-sm text-yellow-800">
              <CircleAlertIcon className="size-5 shrink-0" />
              <p>
                مشاور محترم در هنگام نوشتن کارت جلسه لطفا تمامی مشخصات را تکمیل
                نمایید
              </p>
            </div>
            {/* Date and Time Section - Only visible when editing */}
            {isEditing && (
              <div className="mt-2 rounded-lg border border-gray-200 p-4 pt-4">
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-medium">
                    تاریخ و ساعت جلسه
                  </label>
                  <Button
                    variant="blue"
                    type="button"
                    onClick={() => setIsDateTimeModalOpen(true)}
                    className="!h-fit !w-fit !rounded-md !px-2 !py-1 !text-xs">
                    <Edit2 size={14} />
                    <span>ویرایش</span>
                  </Button>
                </div>
                <div className="flex items-center gap-x-4 rounded-md">
                  <div className="flex h-14 w-full items-center gap-x-2 rounded-md bg-neutral-100 px-5">
                    <CalendarIcon className="size-5 text-gray-500" />
                    <span className="text-sm">
                      {sessionDate.format("dddd D MMMM")}
                    </span>
                  </div>
                  <div className="flex h-14 w-full items-center gap-x-2 rounded-md bg-neutral-100 px-5">
                    <Clock className="size-5 text-gray-500" />
                    <span className="-mb-0.5 text-sm">
                      {customTime.hour.toString().padStart(2, "0")}:
                      {customTime.minute.toString().padStart(2, "0")}
                    </span>
                  </div>
                </div>
              </div>
            )}
            <SessionBasicInfoForm register={register} errors={errors} />

            <div className="flex flex-col gap-4 md:flex-row">
              {/* Users Section */}
              <SessionUsersList
                selectedUsers={selectedUsers}
                editUser={editUser}
                removeUser={removeUser}
                openAddUserModal={openAddUserModal}
              />

              {/* Estate Selection */}
              <EstatePickerButton
                onOpen={() => setIsEstateModalOpen(true)}
                hasSelected={!!watch("estate")?.id}
                error={undefined}
                watch={watch}
                onClear={() => {
                  setValue("estate", {});
                }}
              />
            </div>

            {/* Session Basic Info */}
            {/* Moved into SessionBasicInfoForm above */}

            {/* Owner Prices */}
            <OwnerPricesForm
              register={register}
              errors={errors}
              setValue={setValue}
              session={session.data?.data}
            />

            {/* Applicant Information */}
            <ApplicantInfoForm
              register={register}
              errors={errors}
              setValue={setValue}
              session={session.data?.data}
            />

            {/* Questions Section */}
            <QuestionsSection
              register={register}
              errors={errors}
              watch={watch}
              setValue={setValue}
            />
          </div>
          <div className="flex items-center justify-center gap-x-4 pb-7">
            <Button
              type="button"
              className="!px-10"
              onClick={handleSubmit(onSubmit)}
              isLoading={mutateSession.isPending}>
              ثبت
            </Button>
            <BorderedButton
              type="button"
              className="!px-10"
              onClick={() => setIsOpenModal(false)}>
              لغو
            </BorderedButton>
          </div>
        </Modal>,
        document.body,
      )}

      {/* User Selection Modal */}
      <UserSelector
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        onSelectUser={addUserToSession}
        editingUserId={editingUserId}
        editingUserInfo={
          editingUserId
            ? selectedUsers.find((user) => user.userId === editingUserId)
            : undefined
        }
        currentUsers={selectedUsers}
      />

      {/* Date and Time Selection Modal */}
      <SessionDateTimeModal
        isOpen={isDateTimeModalOpen}
        onClose={() => setIsDateTimeModalOpen(false)}
        sessionDate={sessionDate}
        customTime={customTime}
        staticSessionTimes={staticSessionTimes}
        onUpdate={handleDateTimeUpdate}
      />

      {/* Estate Selection Modal */}
      <EstateSelector
        isOpen={isEstateModalOpen}
        onClose={() => setIsEstateModalOpen(false)}
        onSelectEstate={(estate) => {
          setValue("estate", {
            id: estate.id,
            title: estate.title,
            estateCode: estate.estateCode,
            thumbnailUrl: estate.thumbnailUrl,
          });
          setIsEstateModalOpen(false);
        }}
        currentEstateId={getValues("estate")?.id}
      />
    </>
  );
}
