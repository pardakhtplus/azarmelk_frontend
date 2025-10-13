"use client";

import { cn } from "@/lib/utils";
import { Share2Icon } from "lucide-react";
import { useState } from "react";

interface ShareButtonProps {
  className?: string;
  url?: string;
}

export default function ShareButton({ className, url }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          url: url || window.location.href,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      // Fallback to copy to clipboard
      try {
        await navigator.clipboard.writeText(url || window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        console.error("Error copying to clipboard:", error);
      }
    }
  };

  return (
    <button
      onClick={handleShare}
      className={cn(
        "flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm transition-colors hover:bg-gray-50",
        className,
      )}>
      <Share2Icon className="size-5" />
      <span>{copied ? "کپی شد!" : "اشتراک‌گذاری"}</span>
    </button>
  );
}
