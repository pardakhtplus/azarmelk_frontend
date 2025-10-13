"use client";

import { cn } from "@/lib/utils";
import useToggleEstateSave from "@/services/mutations/client/dashboard/estate/useToggleEstateSave";
import { BookmarkCheckIcon, BookmarkIcon, Loader2Icon } from "lucide-react";
import { useState } from "react";

interface SaveButtonProps {
  className?: string;
  estateId: string;
  initialIsSaved: boolean;
}

export default function SaveButton({
  className,
  estateId,
  initialIsSaved,
}: SaveButtonProps) {
  const { toggleEstateSave } = useToggleEstateSave();
  const [isSaved, setIsSaved] = useState(initialIsSaved);

  const handleSave = async () => {
    const res = await toggleEstateSave.mutateAsync(estateId);

    if (!res) return;

    setIsSaved(!isSaved);
  };

  return (
    <button
      onClick={handleSave}
      className={cn(
        "flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm transition-colors hover:bg-gray-50",
        isSaved && "!bg-primary !text-white",
        className,
        toggleEstateSave.isPending && "!pointer-events-none opacity-50",
      )}>
      {toggleEstateSave.isPending && (
        <Loader2Icon className="size-5 animate-spin" />
      )}
      {isSaved ? (
        <BookmarkCheckIcon className="size-5" />
      ) : (
        <BookmarkIcon className="size-5" />
      )}
      <span>{isSaved ? "ذخیره شده" : "ذخیره"}</span>
    </button>
  );
}
