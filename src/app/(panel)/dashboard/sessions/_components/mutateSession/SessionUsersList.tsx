"use client";

import CustomImage from "@/components/modules/CustomImage";
import Button from "@/components/modules/buttons/Button";
import { Edit2, Plus, XIcon } from "lucide-react";
import { type TSelectedUser } from "./UserSelector";

interface SessionUsersListProps {
  selectedUsers: TSelectedUser[];
  editUser: (userId: string) => void;
  removeUser: (userId: string) => void;
  openAddUserModal: () => void;
}

export default function SessionUsersList({
  selectedUsers,
  editUser,
  removeUser,
  openAddUserModal,
}: SessionUsersListProps) {
  return (
    <div className="w-full rounded-lg border border-primary-border p-4">
      <div className="flex items-center justify-between">
        <label htmlFor="title" className="text-sm">
          مشاوران معامله
        </label>
      </div>

      {/* Selected users list */}
      <div className="flex flex-wrap items-center gap-3 pt-2">
        {selectedUsers.map((user) => (
          <div
            key={user.userId}
            className="flex items-center gap-x-3 rounded-full border border-primary-border p-1">
            <div className="size-7 overflow-hidden rounded-full bg-neutral-200">
              {user.avatar ? (
                <CustomImage
                  src={user.avatar.url || "/images/profile-placeholder.jpg"}
                  alt="placeholder"
                  width={100}
                  height={100}
                  className="size-full object-cover"
                />
              ) : (
                <p className="flex size-full items-center justify-center text-sm font-medium">
                  {user.firstName.charAt(0)}
                </p>
              )}
            </div>
            <p className="text-xs">
              {user.firstName} {user.lastName} ({user.percent}%)
            </p>
            <div className="flex items-center">
              <button
                type="button"
                onClick={() => editUser(user.userId)}
                className="ml-1 rounded-full bg-neutral-100 p-1.5 hover:bg-neutral-200">
                <Edit2 size={14} />
              </button>
              <button
                type="button"
                onClick={() => removeUser(user.userId)}
                className="ml-1 rounded-full bg-neutral-100 p-1.5 hover:bg-neutral-200">
                <XIcon size={14} />
              </button>
            </div>
          </div>
        ))}
        <Button
          type="button"
          onClick={openAddUserModal}
          className="flex !h-9 items-center gap-x-1 !pl-5 !pr-4">
          <Plus size={16} />
          <span className="text-xs">افزودن مشاور</span>
        </Button>
      </div>

      {/* Total percentage display */}
      {selectedUsers.length > 0 && (
        <div className="mt-2 text-xs">
          <span className="font-medium">مجموع درصد: </span>
          <span
            className={
              selectedUsers.reduce((sum, user) => sum + user.percent, 0) !== 100
                ? "text-red-500"
                : "text-primary-green"
            }>
            {selectedUsers.reduce((sum, user) => sum + user.percent, 0)}%
          </span>
        </div>
      )}
    </div>
  );
}
