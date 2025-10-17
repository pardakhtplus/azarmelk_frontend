"use client";

import { useState } from "react";
import { IUser } from "@/components/Icons";
import { cn } from "@/lib/utils";
import OwnerModal from "./OwnerModal";

interface Owner {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  position: string;
  fixPhoneNumber?: string;
}

interface OwnerCardProps {
  owners?: Owner[];
  className?: string;
}

export default function OwnerCard({ owners, className }: OwnerCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOwner, setSelectedOwner] = useState<Owner | null>(null);

  if (!owners || owners.length === 0) {
    return null;
  }

  const handleOwnerClick = (owner: Owner) => {
    setSelectedOwner(owner);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOwner(null);
  };

  return (
    <>
      <section className={cn("my-10", className)}>
        <h2 className="text-base font-medium">اطلاعات مالکان</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          {owners.map((owner) => (
            <button
              key={owner.id}
              onClick={() => handleOwnerClick(owner)}
              className="flex items-center gap-2 rounded-lg border border-primary-blue/80 bg-primary-blue/10 px-4 py-3 text-primary-blue transition-colors hover:bg-primary-blue/20">
              <IUser className="size-5" />
              <span className="text-sm font-medium">
                {owner.firstName} {owner.lastName}
              </span>
            </button>
          ))}
        </div>
      </section>

      <OwnerModal
        isOpen={isModalOpen}
        owner={selectedOwner}
        onClose={closeModal}
      />
    </>
  );
}
