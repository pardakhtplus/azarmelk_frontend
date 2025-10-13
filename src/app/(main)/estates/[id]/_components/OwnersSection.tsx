"use client";

import { PermissionGuardByRole } from "@/permissions/uiPermission";
import { Permissions } from "@/permissions/permission.types";
import OwnerCard from "./OwnerCard";

interface Owner {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  position: string;
}

interface OwnersSectionProps {
  owners?: Owner[];
}

export default function OwnersSection({ owners }: OwnersSectionProps) {
  return (
    <PermissionGuardByRole
      permission={[
        Permissions.GET_ESTATE_OWNERS,
        Permissions.MANAGE_ESTATE,
        Permissions.SUPER_USER,
        Permissions.OWNER,
      ]}>
      <OwnerCard owners={owners} />
    </PermissionGuardByRole>
  );
}
