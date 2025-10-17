"use client";

import { useState } from "react";
import { ArrowRightLeft } from "lucide-react";
import BorderedButton from "@/components/modules/buttons/BorderedButton";
import { cn } from "@/lib/utils";
import TransferAdvisorModal from "./TransferAdvisorModal";

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

interface TransferAdvisorButtonProps {
  currentAdvisor: TAdvisor;
  onSuccess?: () => void;
  className?: string;
}

export default function TransferAdvisorButton({
  currentAdvisor,
  onSuccess,
  className,
}: TransferAdvisorButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <BorderedButton
        type="button"
        variant="blue"
        className={cn("w-full rounded-xl", className)}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          setIsModalOpen(true);
        }}>
        <ArrowRightLeft className="size-5" />
        <span className="block">انتقال املاک</span>
      </BorderedButton>

      <TransferAdvisorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentAdvisor={currentAdvisor}
        onSuccess={() => {
          setIsModalOpen(false);
          if (onSuccess) onSuccess();
        }}
      />
    </>
  );
}
