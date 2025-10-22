import CustomImage from "@/components/modules/CustomImage";
import { cn } from "@/lib/utils";
import { type TSession } from "@/types/admin/session/type";

interface SessionUsersProps {
  users: TSession["users"];
  creatorId?: string;
}

export default function SessionUsers({ users, creatorId }: SessionUsersProps) {
  return (
    <div className="mt-10">
      <div className="flex items-center justify-between border-b border-primary-border/30 pb-3">
        <h2 className="text-xl font-medium">مشاوران جلسه</h2>
      </div>
      <div className="mt-5">
        {users && users.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {users.map((userItem) => {
              const user = userItem.user;
              const isCreator = creatorId === user.id;
              const avatarSrc =
                user.avatar?.url || "/images/profile-placeholder.jpg";
              const initials =
                (user.firstName?.[0] || "") + (user.lastName?.[0] || "");
              return (
                <div
                  key={user.id}
                  className={cn(
                    "relative flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm",
                    isCreator && "border-primary-blue",
                  )}
                  title={`${user.firstName} ${user.lastName}${isCreator ? " (ایجاد کننده)" : ""}`}>
                  <div className="relative">
                    {user.avatar ? (
                      <CustomImage
                        src={avatarSrc}
                        alt="avatar"
                        width={48}
                        height={48}
                        className="size-12 rounded-full border border-gray-200 object-cover"
                      />
                    ) : (
                      <div className="bg-primary-100 text-primary-600 flex size-12 items-center justify-center rounded-full border border-gray-200 bg-gray-100 text-lg font-bold">
                        {initials}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p
                        className="truncate font-medium"
                        title={`${user.firstName} ${user.lastName}`}>
                        {user.firstName} {user.lastName}
                      </p>
                      <span className="text-xs text-gray-400">
                        {user.phoneNumber || ""}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-sm text-gray-600">سهم:</span>
                      <span className="font-bold text-primary">
                        {userItem.percent}%
                      </span>
                    </div>
                    <div className="mt-2 h-2 w-full rounded bg-gray-100">
                      <div
                        className="h-2 rounded bg-primary transition-all"
                        style={{ width: `${userItem.percent}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-500">
            هیچ مشاوری برای این جلسه ثبت نشده است.
          </p>
        )}
      </div>
    </div>
  );
}
