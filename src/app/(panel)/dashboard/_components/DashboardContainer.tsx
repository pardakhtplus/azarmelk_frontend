"use client";

import PanelBodyHeader from "@/app/(panel)/_components/PanelBodyHeader";
import Link from "next/link";
import StatCard from "./StatCard";
import {
  Building2,
  Users,
  FileText,
  CheckCircle2,
  Clock,
  Archive,
  TrendingUp,
  Home,
  Trash2,
  CalendarClock,
  BellRing,
  XCircleIcon,
} from "lucide-react";
import { useMemo } from "react";
import { useDashboardStats } from "@/services/queries/admin/dashboard/useDashboardStats";
import EstateCardItem from "@/components/modules/estate/EstateCardItem";
import { cn, dateType } from "@/lib/utils";
import { useUserInfo } from "@/services/queries/client/auth/useUserInfo";
import { Permissions } from "@/permissions/permission.types";
import { useSessionList } from "@/services/queries/admin/session/useSessionList";
import { useSessionCreatedList } from "@/services/queries/admin/session/useSessionCreatedList";
import { rooms } from "@/app/(panel)/dashboard/sessions/_components/types";
import { SESSION_STATUS } from "@/types/admin/session/enum";
import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import gregorian from "react-date-object/calendars/gregorian";
import gregorian_en from "react-date-object/locales/gregorian_en";

export default function DashboardContainer() {
  const { userInfo } = useUserInfo();
  const accessPerms = userInfo.data?.data.accessPerms ?? [];

  const canManageUsers =
    accessPerms.includes(Permissions.EDIT_USERS) ||
    accessPerms.includes(Permissions.SUPER_USER) ||
    accessPerms.includes(Permissions.OWNER);

  const canManageEstate =
    accessPerms.includes(Permissions.MANAGE_ESTATE) ||
    accessPerms.includes(Permissions.SUPER_USER) ||
    accessPerms.includes(Permissions.OWNER);

  const canViewEstate =
    canManageEstate || accessPerms.includes(Permissions.GET_ESTATE);

  const canCreateEstate =
    canManageEstate || accessPerms.includes(Permissions.CREATE_ESTATE);

  const canManageSession =
    accessPerms.includes(Permissions.MANAGE_SESSION) ||
    accessPerms.includes(Permissions.SUPER_USER) ||
    accessPerms.includes(Permissions.OWNER);

  const canCreateSession =
    canManageSession || accessPerms.includes(Permissions.CREATE_SESSION);

  const canSeeSession =
    canManageSession || accessPerms.includes(Permissions.GET_SESSION);

  const canViewSessions = canManageSession || canCreateSession || canSeeSession;

  const { stats, isLoading } = useDashboardStats({
    canSeeEstates: canViewEstate,
    canManageEstates: canManageEstate,
    canManageUsers: canManageUsers,
  });

  const todayFormatted = useMemo(() => {
    return new DateObject({ calendar: persian, locale: persian_fa })
      .setHour(0)
      .setMinute(0)
      .setSecond(0)
      .setMillisecond(0)
      .convert(gregorian, gregorian_en)
      .toUTC()
      .format(dateType);
  }, []);

  const { sessionList: adminRoom1 } = useSessionList({
    day: todayFormatted,
    room: rooms[0].room,
    enabled: Boolean(canManageSession),
  });
  const { sessionList: adminRoom2 } = useSessionList({
    day: todayFormatted,
    room: rooms[1].room,
    enabled: Boolean(canManageSession),
  });
  const { sessionList: adminRoom3 } = useSessionList({
    day: todayFormatted,
    room: rooms[2].room,
    enabled: Boolean(canManageSession),
  });

  const { sessionCreatedList: createdRoom1 } = useSessionCreatedList({
    day: todayFormatted,
    room: rooms[0].room,
    enabled: Boolean(
      canViewSessions &&
        !canManageSession &&
        (canCreateSession || canSeeSession),
    ),
  });
  const { sessionCreatedList: createdRoom2 } = useSessionCreatedList({
    day: todayFormatted,
    room: rooms[1].room,
    enabled: Boolean(
      canViewSessions &&
        !canManageSession &&
        (canCreateSession || canSeeSession),
    ),
  });
  const { sessionCreatedList: createdRoom3 } = useSessionCreatedList({
    day: todayFormatted,
    room: rooms[2].room,
    enabled: Boolean(
      canViewSessions &&
        !canManageSession &&
        (canCreateSession || canSeeSession),
    ),
  });

  const roomQueries = [
    {
      room: rooms[0],
      adminQuery: adminRoom1,
      createdQuery: createdRoom1,
    },
    {
      room: rooms[1],
      adminQuery: adminRoom2,
      createdQuery: createdRoom2,
    },
    {
      room: rooms[2],
      adminQuery: adminRoom3,
      createdQuery: createdRoom3,
    },
  ];

  const todaySessions = roomQueries.flatMap(
    ({ room, adminQuery, createdQuery }) => {
      const sessions = canManageSession
        ? (adminQuery.data?.data.sessions ?? [])
        : (createdQuery.data?.data.sessions ?? []);

      return sessions.map((session) => ({
        ...session,
        roomName: room.name,
      }));
    },
  );

  const orderedTodaySessions = [...todaySessions].sort((a, b) => {
    const aTime = new Date(a.startSession).getTime();
    const bTime = new Date(b.startSession).getTime();
    return aTime - bTime;
  });

  const displayedTodaySessions = orderedTodaySessions.slice(0, 6);

  const isTodaySessionsLoading = roomQueries.some(
    ({ adminQuery, createdQuery }) =>
      canManageSession ? adminQuery.isLoading : createdQuery.isLoading,
  );

  const hasTodaySessions = displayedTodaySessions.length > 0;

  const formatTimeRange = (start: string) => {
    const formatter = new Intl.DateTimeFormat("fa-IR", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const startTime = start ? formatter.format(new Date(start)) : "-";

    return `${startTime}`;
  };

  const renderStatusBadge = (status?: SESSION_STATUS) => {
    if (!status) return null;

    const statusConfig: Record<
      SESSION_STATUS,
      { label: string; className: string; dotClass: string }
    > = {
      [SESSION_STATUS.CONFIRMED]: {
        label: "تایید شده",
        className: "bg-green-100 text-green-700",
        dotClass: "bg-green-500",
      },
      [SESSION_STATUS.PENDING]: {
        label: "در انتظار تایید",
        className: "bg-amber-100 text-amber-700",
        dotClass: "bg-amber-500",
      },
      [SESSION_STATUS.REJECTED]: {
        label: "رد شده",
        className: "bg-red-100 text-red-700",
        dotClass: "bg-red-500",
      },
      [SESSION_STATUS.CANCELED]: {
        label: "لغو شده",
        className: "bg-gray-100 text-gray-600",
        dotClass: "bg-gray-400",
      },
    };

    const config = statusConfig[status];

    if (!config) return null;

    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium",
          config.className,
        )}>
        <span className={cn("size-1.5 rounded-full", config.dotClass)} />
        {config.label}
      </span>
    );
  };

  return (
    <>
      <PanelBodyHeader
        title="داشبورد"
        breadcrumb={
          <>
            <Link href="/dashboard">داشبورد</Link>
          </>
        }
      />

      <div className="space-y-5 pt-6 sm:space-y-6 lg:space-y-7">
        {displayedTodaySessions.some((session) =>
          session.users?.some(
            (user) => user.user?.id === userInfo.data?.data.id,
          ),
        ) ? (
          <div className="w-full rounded-lg border border-amber-300 bg-amber-50/70 px-3 py-2 text-amber-900 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
              <div className="flex items-center gap-x-3">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                  <BellRing className="size-5" />
                </div>
                <span className="font-semibold">امروز جلسه دارید</span>
              </div>
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold">
                {displayedTodaySessions.length} جلسه
              </span>
            </div>
          </div>
        ) : null}

        {/* Stats Grid */}
        {canManageEstate ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <StatCard
              title="مجموع املاک"
              value={stats.data?.estates.total || 0}
              icon={Building2}
              color="blue"
              isLoading={isLoading}
            />
            <StatCard
              title="املاک فعال"
              value={stats.data?.estates.published || 0}
              icon={CheckCircle2}
              color="green"
              isLoading={isLoading}
            />
            <StatCard
              title="املاک غیرفعال"
              value={stats.data?.estates.pending || 0}
              icon={XCircleIcon}
              color="orange"
              isLoading={isLoading}
            />

            <StatCard
              title="درخواست‌های در انتظار"
              value={stats.data?.requests.pending || 0}
              icon={Clock}
              color="orange"
              isLoading={isLoading}
            />
            <StatCard
              title="املاک آرشیو شده"
              value={stats.data?.estates.archived || 0}
              icon={Archive}
              color="indigo"
              isLoading={isLoading}
            />
            <StatCard
              title="املاک حذف شده"
              value={stats.data?.estates.deleted || 0}
              icon={Trash2}
              color="red"
              isLoading={isLoading}
            />
          </div>
        ) : null}

        {/* Today's Sessions Section */}
        {canViewSessions ? (
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
            <div className="mb-5 flex flex-col gap-4 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center justify-start gap-3 sm:justify-start">
                <div className="flex size-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 max-sm:hidden">
                  <CalendarClock className="size-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
                    جلسات امروز
                  </h2>
                  <p className="text-sm text-gray-500">
                    مرور سریع نشست‌های برنامه‌ریزی شده برای امروز
                  </p>
                </div>
              </div>
              <Link
                href="/dashboard/sessions"
                className="flex items-center justify-center gap-2 rounded-lg bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-600 transition-all hover:bg-indigo-100">
                مدیریت جلسات
                <TrendingUp className="size-4" />
              </Link>
            </div>

            {!canViewSessions ? (
              <div className="rounded-lg bg-gray-50 p-6 text-center text-sm text-gray-500">
                برای مشاهده جلسات نیاز به دسترسی مناسب دارید.
              </div>
            ) : isTodaySessionsLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="h-20 animate-pulse rounded-lg bg-gray-100"
                  />
                ))}
              </div>
            ) : hasTodaySessions ? (
              <div className="space-y-4">
                {displayedTodaySessions.map((session) => (
                  <Link
                    href={`/dashboard/sessions/${session.id}`}
                    target="_blank"
                    key={session.id}
                    className="block rounded-lg border border-gray-100 bg-gray-50/60 p-4 transition-all hover:border-indigo-200 hover:bg-indigo-50/50">
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-base font-semibold text-gray-900">
                          {session.title || "جلسه بدون عنوان"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {session.roomName}
                        </p>
                      </div>
                      {renderStatusBadge(session.status as SESSION_STATUS)}
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Clock className="size-4 text-gray-400" />
                        {formatTimeRange(session.startSession)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="size-4 text-gray-400" />
                        {session.users?.length || 0} نفر
                      </span>
                      {session.creator?.firstName &&
                      session.creator?.lastName ? (
                        <span className="flex items-center gap-1">
                          <CalendarClock className="size-4 text-gray-400" />
                          {`${session.creator.firstName} ${session.creator.lastName}`}
                        </span>
                      ) : null}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-lg bg-gray-50 py-10 text-center text-gray-500 sm:py-12">
                <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-indigo-50 text-indigo-500">
                  <CalendarClock className="size-8" />
                </div>
                <p className="text-base font-semibold text-gray-800">
                  جلسه‌ای برای امروز ثبت نشده است
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  از بخش مدیریت جلسات می‌توانید جلسات جدیدی ایجاد کنید.
                </p>
              </div>
            )}
          </div>
        ) : null}

        {/* Recent Estates Section */}
        {canViewEstate || canManageEstate ? (
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
            <div className="mb-5 flex flex-col gap-4 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center justify-start gap-3 sm:justify-start">
                <div className="flex size-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 max-sm:hidden">
                  <Home className="size-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
                    جدیدترین املاک
                  </h2>
                  <p className="text-sm text-gray-500">
                    آخرین املاک اضافه شده به سیستم
                  </p>
                </div>
              </div>
              <Link
                href="/dashboard/estates"
                className="flex items-center justify-center gap-2 rounded-lg bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600 transition-all hover:bg-blue-100">
                مشاهده همه
                <TrendingUp className="size-4" />
              </Link>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-96 animate-pulse rounded-xl bg-gray-100"
                  />
                ))}
              </div>
            ) : stats.data?.recentEstates &&
              stats.data.recentEstates.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {stats.data.recentEstates.slice(0, 6).map((estate) => (
                  <EstateCardItem key={estate.id} estate={estate} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center sm:py-12">
                <div className="mb-4 flex size-20 items-center justify-center rounded-full bg-gray-100">
                  <Building2 className="size-10 text-gray-400" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  هیچ ملکی یافت نشد
                </h3>
                <p className="mb-6 text-sm text-gray-500">
                  در حال حاضر هیچ ملکی در سیستم ثبت نشده است
                </p>
                {canCreateEstate ? (
                  <Link
                    href="/dashboard/estates/create"
                    className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition-all hover:bg-blue-700">
                    افزودن ملک جدید
                  </Link>
                ) : null}
              </div>
            )}
          </div>
        ) : null}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {canCreateEstate ? (
            <Link
              href="/dashboard/estates/create"
              className={cn(
                "group rounded-xl border-2 border-dashed border-gray-300 bg-white p-5 sm:p-6",
                "transition-all hover:border-blue-500 hover:bg-blue-50",
              )}>
              <div className="flex items-center gap-4">
                <div className="flex size-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600 transition-all group-hover:scale-110">
                  <Building2 className="size-6" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">افزودن ملک</p>
                  <p className="text-sm text-gray-500">ثبت ملک جدید</p>
                </div>
              </div>
            </Link>
          ) : null}

          {canViewEstate || canManageEstate ? (
            <Link
              href={
                canViewEstate
                  ? "/dashboard/estates"
                  : "/dashboard/estate/manage-estates"
              }
              className={cn(
                "group rounded-xl border-2 border-dashed border-gray-300 bg-white p-5 sm:p-6",
                "transition-all hover:border-green-500 hover:bg-green-50",
              )}>
              <div className="flex items-center gap-4">
                <div className="flex size-12 items-center justify-center rounded-lg bg-green-100 text-green-600 transition-all group-hover:scale-110">
                  <CheckCircle2 className="size-6" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">مدیریت املاک</p>
                  <p className="text-sm text-gray-500">مشاهده و ویرایش</p>
                </div>
              </div>
            </Link>
          ) : null}

          {canManageEstate ? (
            <Link
              href="/dashboard/estates/requests"
              className={cn(
                "group rounded-xl border-2 border-dashed border-gray-300 bg-white p-5 sm:p-6",
                "transition-all hover:border-orange-500 hover:bg-orange-50",
              )}>
              <div className="flex items-center gap-4">
                <div className="flex size-12 items-center justify-center rounded-lg bg-orange-100 text-orange-600 transition-all group-hover:scale-110">
                  <FileText className="size-6" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">درخواست‌ها</p>
                  <p className="text-sm text-gray-500">مشاهده درخواست‌ها</p>
                </div>
              </div>
            </Link>
          ) : null}

          {canManageUsers ? (
            <Link
              href="/dashboard/users?type=users"
              className={cn(
                "group rounded-xl border-2 border-dashed border-gray-300 bg-white p-5 sm:p-6",
                "transition-all hover:border-purple-500 hover:bg-purple-50",
              )}>
              <div className="flex items-center gap-4">
                <div className="flex size-12 items-center justify-center rounded-lg bg-purple-100 text-purple-600 transition-all group-hover:scale-110">
                  <Users className="size-6" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">کاربران</p>
                  <p className="text-sm text-gray-500">مدیریت کاربران</p>
                </div>
              </div>
            </Link>
          ) : null}
        </div>
      </div>
    </>
  );
}
