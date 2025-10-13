// src/app/(panel)/dashboard/users/_components/SearchModal.tsx
"use client";

import { useState } from "react";
import Modal from "@/components/modules/Modal";
import Input from "@/components/modules/inputs/Input";
import Button from "@/components/modules/buttons/Button";
import { SearchIcon, XIcon } from "lucide-react";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (searchTerm: string) => void;
  searchValue?: string;
}

export default function SearchModal({
  isOpen,
  onClose,
  onSearch,
  searchValue = "",
}: SearchModalProps) {
  const [searchTerm, setSearchTerm] = useState(searchValue);

  const handleSearch = () => {
    onSearch(searchTerm);
    onClose();
  };

  const handleClear = () => {
    setSearchTerm("");
    onSearch("");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onCloseModal={onClose}
      onClickOutside={onClose}
      title="جستجو در کاربران"
      classNames={{
        background: "z-[60] !py-0 !px-4",
        box: "!max-w-lg !max-h-[95%] rounded-xl overflow-x-hidden !h-fit",
        header: "!py-4",
      }}>
      <div className="space-y-4 p-6">
        <div className="space-y-2">
          <label className="text-text-700 text-sm font-medium">
            جستجو کاربران و پرسنل
          </label>
          <div className="relative">
            <Input
              name="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-12"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSearch();
                }
              }}
            />
            <SearchIcon className="absolute right-4 top-1/2 size-5 -translate-y-1/2 text-text-300" />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button
            variant="blue"
            onClick={handleClear}
            className="flex items-center gap-2">
            <XIcon className="size-5" />
            پاک کردن
          </Button>
          <Button onClick={handleSearch} className="flex items-center gap-2">
            <SearchIcon className="size-5" />
            جستجو
          </Button>
        </div>
      </div>
    </Modal>
  );
}
