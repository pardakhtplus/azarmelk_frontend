"use client";

import BorderedButton from "@/components/modules/buttons/BorderedButton";
import Button from "@/components/modules/buttons/Button";
import BorderedInput from "@/components/modules/inputs/BorderedInput";
import Modal from "@/components/modules/Modal";
import { useAdviserList } from "@/services/queries/admin/estate/useAdviserList";
import { debounce } from "lodash";
import { Check, Search } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import toast from "react-hot-toast";

export type TSelectedUser = {
  userId: string;
  firstName: string;
  lastName: string;
  avatar?: {
    url: string;
  };
  percent: number;
};

interface UserSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectUser: (user: TSelectedUser) => void;
  editingUserId: string | null;
  editingUserInfo?: TSelectedUser;
  currentUsers: TSelectedUser[];
}

export default function UserSelector({
  isOpen,
  onClose,
  onSelectUser,
  editingUserId,
  editingUserInfo,
  currentUsers,
}: UserSelectorProps) {
  const [selectedUser, setSelectedUser] = useState<{
    key: string;
    firstName: string;
    lastName: string;
    avatar?: {
      url: string;
    };
  } | null>(null);
  const [userPercent, setUserPercent] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchInputValue, setSearchInputValue] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [adviserListData, setAdviserListData] = useState<
    Array<{
      id: string;
      firstName: string;
      lastName: string;
      phoneNumber: string;
      avatar?: {
        url: string;
      };
    }>
  >([]);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const { adviserList } = useAdviserList({
    params: {
      page,
      limit: 5,
      search: searchQuery,
    },
  });

  // Set initial values for editing
  useEffect(() => {
    if (isOpen) {
      if (editingUserId && editingUserInfo) {
        setSelectedUser({
          key: editingUserInfo.userId,
          firstName: editingUserInfo.firstName,
          lastName: editingUserInfo.lastName,
          avatar: editingUserInfo.avatar,
        });
        setUserPercent(editingUserInfo.percent.toString());
      } else {
        setSelectedUser(null);
        setUserPercent("");
      }
    }
  }, [isOpen, editingUserId, editingUserInfo]);

  // Reset search and pagination when opening modal or when modal is closed
  useEffect(() => {
    if (isOpen && !editingUserId) {
      setSearchQuery("");
      setSearchInputValue("");
      setPage(1);
      setAdviserListData([]);
    } else if (!isOpen) {
      setSearchQuery("");
      setSearchInputValue("");
      setPage(1);
      setAdviserListData([]);
    }
  }, [isOpen, editingUserId]);

  // Update userListData when userList changes
  useEffect(() => {
    if (adviserList?.data?.data?.advisers) {
      if (page === 1) {
        setAdviserListData(adviserList.data.data.advisers);
      } else {
        setAdviserListData((prev) => [
          ...prev,
          ...(adviserList.data?.data.advisers || []),
        ]);
      }
    }
  }, [adviserList?.data?.data?.advisers, page, searchQuery]);

  // Setup intersection observer for infinite scroll
  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (
        entry.isIntersecting &&
        adviserList?.data?.data?.pagination &&
        adviserList.data.data.pagination.pageNumber <
          adviserList.data.data.pagination.totalPages
      ) {
        setPage((prev) => prev + 1);
      }
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [adviserList?.data?.data?.pagination, isOpen]);

  // Observe loadMoreRef when it's available
  useEffect(() => {
    if (observerRef.current && loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }
  }, [adviserListData.length, isOpen]);

  // Debounced search function
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      setSearchQuery(query);
      setPage(1);
      setAdviserListData([]);
    }, 500),
    [],
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInputValue(value);
    debouncedSearch(value);
  };

  const selectUser = (user: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: {
      url: string;
    };
  }) => {
    setSelectedUser({
      key: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar,
    });
  };

  const handleAddUser = () => {
    if (Number(userPercent) > 100)
      return toast.error("درصد سود نباید بیشتر از ۱۰۰ باشد!");

    if ((selectedUser || editingUserId) && userPercent) {
      const percentValue = Number(userPercent);

      if (editingUserId) {
        onSelectUser({
          userId: editingUserId,
          firstName: editingUserInfo?.firstName || "",
          lastName: editingUserInfo?.lastName || "",
          avatar: editingUserInfo?.avatar || { url: "" },
          percent: percentValue,
        });
      } else if (selectedUser) {
        onSelectUser({
          userId: selectedUser.key,
          firstName: selectedUser.firstName,
          lastName: selectedUser.lastName,
          avatar: selectedUser.avatar,
          percent: percentValue,
        });
      }
    }
  };

  const handleClose = () => {
    setSearchInputValue("");
    setSearchQuery("");
    onClose();
  };

  return createPortal(
    <Modal
      doNotHiddenOverflow
      isOpen={isOpen}
      title={editingUserId ? "ویرایش مشاور" : "افزودن مشاور به جلسه"}
      classNames={{
        background: "z-[60] !py-0 sm:!px-4 !px-0",
        box: "sm:!max-w-md sm:!max-h-[95%] overflow-x-hidden !max-h-none !max-w-none rounded-none !h-full sm:!h-fit flex flex-col justify-between sm:rounded-xl",
      }}
      onCloseModal={handleClose}
      onClickOutside={handleClose}>
      <div className="flex flex-col gap-y-4 px-6 py-7">
        <div>
          <label className="text-sm">انتخاب مشاور</label>
          {editingUserId ? (
            <div className="mt-2 flex h-12 items-center rounded-xl border border-primary-border px-3 text-sm">
              {selectedUser?.firstName + " " + selectedUser?.lastName || ""}
            </div>
          ) : (
            <>
              {/* Search input */}
              <div className="relative mt-2">
                <input
                  type="text"
                  value={searchInputValue}
                  onChange={handleSearch}
                  placeholder="جستجوی نام"
                  className="w-full rounded-xl border border-primary-border px-3 py-3 pr-5 text-sm outline-none focus:border-black/50"
                />
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
              </div>

              {/* User list with infinite scroll */}
              <div className="mt-2 max-h-48 overflow-y-auto rounded-xl border border-primary-border">
                {adviserList.isLoading && adviserListData.length === 0 ? (
                  <div className="flex h-12 items-center justify-center">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-primary" />
                  </div>
                ) : adviserListData.length === 0 ? (
                  <div className="flex h-12 items-center justify-center text-sm text-gray-500">
                    کاربری یافت نشد
                  </div>
                ) : (
                  <>
                    {adviserListData
                      .filter(
                        (user) =>
                          !currentUsers.find(
                            (currentUser) => currentUser.userId === user.id,
                          ),
                      )
                      .map((user) => (
                        <div
                          key={user.id}
                          className={`cursor-pointer border-b border-primary-border px-3 py-3 transition-all duration-200 hover:bg-gray-50 ${
                            selectedUser?.key === user.id
                              ? "border-r-4 border-r-primary bg-primary/5 shadow-sm"
                              : ""
                          }`}
                          onClick={() => selectUser(user)}>
                          <div className="flex items-center gap-x-3">
                            <div className="size-7 overflow-hidden rounded-full bg-neutral-200">
                              {user.avatar ? (
                                <Image
                                  src={
                                    user.avatar.url ||
                                    "/images/profile-placeholder.jpg"
                                  }
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
                            <div className="flex-1">
                              <p className="text-sm font-medium">
                                {user.firstName} {user.lastName}
                              </p>
                              <p className="text-xs text-gray-500">
                                {user.phoneNumber}
                              </p>
                            </div>
                            {selectedUser?.key === user.id && (
                              <div className="flex size-5 items-center justify-center rounded-full bg-primary text-white">
                                <Check size={12} />
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    <div ref={loadMoreRef} className="h-4 w-full" />
                    {adviserList.isFetching && adviserListData.length > 0 && (
                      <div className="flex h-10 items-center justify-center">
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-primary" />
                      </div>
                    )}
                  </>
                )}
              </div>
            </>
          )}
        </div>
        <div>
          <label className="text-sm">درصد سود</label>
          <BorderedInput
            name="userPercent"
            value={userPercent}
            onChange={(e) => setUserPercent(e.target.value)}
            containerClassName="mt-2"
            type="number"
            min="0"
            max="100"
          />
          <p className="mt-1 text-xs text-gray-500">
            مجموع درصد فعلی:{" "}
            {currentUsers.reduce(
              (sum, user) =>
                sum + (user.userId !== editingUserId ? user.percent : 0),
              0,
            )}
            %{editingUserId ? " (بدون احتساب درصد فعلی این مشاور)" : ""}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-center gap-x-4 pb-7">
        <Button
          type="button"
          className="!px-10"
          onClick={handleAddUser}
          disabled={(!selectedUser && !editingUserId) || !userPercent}>
          {editingUserId ? "ویرایش" : "افزودن"}
        </Button>
        <BorderedButton type="button" className="!px-10" onClick={handleClose}>
          لغو
        </BorderedButton>
      </div>
    </Modal>,
    document.body,
  );
}
