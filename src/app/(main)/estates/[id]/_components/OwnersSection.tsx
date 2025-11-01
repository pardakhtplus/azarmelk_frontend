"use client";

import OwnerCard from "./OwnerCard";

interface Owner {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  position: string;
  fixPhoneNumber?: string;
}

interface OwnersSectionProps {
  owners?: Owner[];
}

export default function OwnersSection({ owners }: OwnersSectionProps) {
  if (!owners || owners.length === 0) {
    return null;
  }

  return <OwnerCard owners={owners} />;
}
