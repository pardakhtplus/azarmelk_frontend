"use client";

import { FeatureFlag, isFeatureEnabled } from "@/config/features";
import { useSession } from "@/services/queries/admin/session/useSession";
import { SESSION_STATUS } from "@/types/admin/session/enum";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import MutateSession from "../../_components/mutateSession/MutateSession";
import SessionCommentsTabs from "./SessionCommentsTabs";
import SessionCreator from "./SessionCreator";
import SessionHeader from "./SessionHeader";
import SessionInfo from "./SessionInfo";
import SessionUsers from "./SessionUsers";
import { Permissions } from "@/permissions/permission.types";
import { useUserInfo } from "@/services/queries/client/auth/useUserInfo";

export default function SessionDetailContainer() {
  const { id } = useParams();
  const { session } = useSession({ id: id as string });
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const { userInfo } = useUserInfo();
  const sessionData = session?.data?.data;

  const canManageSession =
    userInfo?.data?.data.accessPerms.includes(Permissions.MANAGE_SESSION) ||
    userInfo?.data?.data.accessPerms.includes(Permissions.SUPER_USER) ||
    userInfo?.data?.data.accessPerms.includes(Permissions.OWNER);

  if (!isFeatureEnabled(FeatureFlag.SESSIONS)) {
    return null;
  }

  return (
    <div className="mx-auto w-full max-w-full">
      {sessionData && (
        <>
          <SessionHeader
            isLoading={session?.isLoading}
            title={"جلسه " + (sessionData.title || "")}
            breadcrumb={
              <>
                <Link href="/dashboard/sessions">جلسات</Link> /{" "}
                <span className="text-primary-300">
                  {sessionData.title || ""}
                </span>
              </>
            }
            onEdit={() => setIsOpenEditModal(true)}
            showApprove={sessionData.status === SESSION_STATUS.PENDING}
            showReject={sessionData.status === SESSION_STATUS.PENDING}
            showCancel={sessionData.status === SESSION_STATUS.CONFIRMED}
            showEdit={sessionData.status === SESSION_STATUS.PENDING}
            session={sessionData}
            canManageSession={canManageSession ?? false}
          />
          <SessionInfo session={sessionData} />
          <SessionUsers
            users={sessionData.users}
            creatorId={sessionData.creator?.id}
          />
          <SessionCreator creator={sessionData.creator} />
          {canManageSession && <SessionCommentsTabs sessionId={id as string} />}
        </>
      )}
      {isOpenEditModal && sessionData && (
        <MutateSession
          isOpenModal={isOpenEditModal}
          setIsOpenModal={setIsOpenEditModal}
          startSession={
            new DateObject({
              date: new Date(sessionData.startSession),
              calendar: persian,
              locale: persian_fa,
            })
          }
          room={sessionData.room}
          isEditing={true}
          defaultSessionId={sessionData.id}
        />
      )}
    </div>
  );
}
