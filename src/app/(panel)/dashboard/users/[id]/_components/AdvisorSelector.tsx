"use client";

import CustomImage from "@/components/modules/CustomImage";
import Modal from "@/components/modules/Modal";
import BorderedButton from "@/components/modules/buttons/BorderedButton";
import { cn } from "@/lib/utils";
import { useUserListInfinity } from "@/services/queries/admin/users/useUserListInfinity";
import { ChevronDownIcon, SearchIcon } from "lucide-react";
import { useRef, useState } from "react";
import { createPortal } from "react-dom";

type TAdvisor = {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  avatar?: {
    url: string;
    file_name: string;
    key: string;
    mimeType: string;
  };
  _count: {
    createdEstates: number;
  };
};

interface AdvisorSelectorProps {
  value?: TAdvisor;
  onChange: (advisor: TAdvisor) => void;
  placeholder?: string;
  className?: string;
  exclude?: string; // ID of advisor to exclude from list
}

export default function AdvisorSelector({
  value,
  onChange,
  placeholder = "انتخاب مشاور جدید",
  className,
  exclude,
}: AdvisorSelectorProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  const {
    allUsers,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isLoading,
  } = useUserListInfinity({
    role: "OTHER",
    search: searchQuery,
    enabled: isModalOpen, // Only fetch when modal is open
  });

  // Filter out the excluded advisor
  const filteredAdvisors = exclude
    ? allUsers.filter((user) => user.id !== exclude)
    : allUsers;

  // Handle scroll to load more data
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;

    if (
      scrollHeight - scrollTop <= clientHeight + 100 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  };

  const handleAdvisorSelect = (advisor: TAdvisor) => {
    onChange(advisor);
    setIsModalOpen(false);
    setSearchQuery("");
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSearchQuery("");
  };

  const displayValue = value
    ? `${value.firstName} ${value.lastName} (${value._count.createdEstates} ملک)`
    : placeholder;

  return (
    <>
      <div className={cn("relative", className)}>
        <div
          className="flex h-12 cursor-pointer items-center justify-between gap-x-2 rounded-xl border border-primary-border bg-background px-3 text-sm text-text shadow-sm focus-within:!border-indigo-500 focus-within:ring-1 focus-within:ring-black hover:border-neutral-600"
          onClick={() => setIsModalOpen(true)}>
          <span className="block truncate">{displayValue}</span>
          <ChevronDownIcon className="h-5 w-5 text-gray-400" />
        </div>
      </div>

      {createPortal(
        <Modal
          isOpen={isModalOpen}
          title="انتخاب مشاور"
          size="full"
          classNames={{
            background: "z-[70] !py-0 !px-4",
            box: "!max-w-2xl !max-h-[90%] overflow-hidden !h-fit flex flex-col rounded-xl",
            header: "!py-4 flex-shrink-0",
          }}
          onCloseModal={handleCloseModal}
          onClickOutside={handleCloseModal}>
          {/* Search Input */}
          <div className="flex-shrink-0 border-b border-primary-border p-4">
            <div className="relative">
              <SearchIcon className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="جستجو مشاور..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-black/70 focus:outline-none"
                autoFocus
              />
            </div>
          </div>

          {/* Advisors List */}
          <div
            ref={listRef}
            className="flex-1 overflow-auto px-4 pb-4"
            onScroll={handleScroll}>
            {isLoading && filteredAdvisors.length === 0 ? (
              <div className="flex items-center justify-center p-8">
                <div className="text-sm text-gray-500">در حال بارگذاری...</div>
              </div>
            ) : filteredAdvisors.length === 0 ? (
              <div className="flex items-center justify-center p-8">
                <div className="text-sm text-gray-500">مشاوری یافت نشد</div>
              </div>
            ) : (
              <div className="space-y-2 pt-4">
                {filteredAdvisors.map((advisor) => (
                  <div
                    key={advisor.id}
                    className="flex cursor-pointer items-center gap-3 rounded-lg border border-transparent p-3 hover:border-gray-200 hover:bg-gray-50 active:bg-gray-100"
                    onClick={() => handleAdvisorSelect(advisor)}>
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-200">
                      {advisor.avatar?.url ? (
                        <CustomImage
                          src={advisor.avatar.url}
                          alt={`${advisor.firstName} ${advisor.lastName}`}
                          className="h-10 w-10 rounded-full object-cover"
                          width={40}
                          height={40}
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-300">
                          <span className="text-sm font-medium text-gray-600">
                            {advisor.firstName[0]}
                            {advisor.lastName[0]}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="mb-0.5 text-sm font-medium text-gray-900">
                        {advisor.firstName} {advisor.lastName}
                      </div>
                      <div className="text-xs text-gray-500">
                        {advisor.phoneNumber} • {advisor._count.createdEstates}{" "}
                        ملک
                      </div>
                    </div>
                  </div>
                ))}
                {isFetchingNextPage && (
                  <div className="flex items-center justify-center p-4">
                    <div className="text-sm text-gray-500">
                      بارگذاری موارد بیشتر...
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex flex-shrink-0 justify-end border-t border-primary-border p-4">
            <BorderedButton
              type="button"
              className="px-6"
              onClick={handleCloseModal}>
              لغو
            </BorderedButton>
          </div>
        </Modal>,
        document.body,
      )}
    </>
  );
}
