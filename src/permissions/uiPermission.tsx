import { type ReactNode } from "react";
import {
  canPerform,
  hasAllPermissions,
  hasAnyPermission,
  hasPermission,
} from "./hasPermission";
import {
  type Action,
  type Permissions,
  type Subject,
} from "./permission.types";
import { useUserInfo } from "@/services/queries/client/auth/useUserInfo";

interface CanProps {
  subject: Subject;
  action: Action;
  children: ReactNode;
  fallback?: ReactNode;
}

export function PermissionGuardBySubjectAndAction({
  subject,
  action,
  children,
  fallback = null,
}: CanProps) {
  const { userInfo } = useUserInfo();

  if (!userInfo.data) {
    return null;
  }

  const allowed = canPerform(subject, action, userInfo.data.data.accessPerms);

  return allowed ? <>{children}</> : <>{fallback}</>;
}

interface PermissionGuardProps {
  permission: Permissions | Permissions[];
  children: ReactNode;
  fallback?: ReactNode;
  requireAll?: boolean;
}

export function PermissionGuardByRole({
  permission,
  children,
  fallback = null,
  requireAll = false,
}: PermissionGuardProps) {
  const { userInfo } = useUserInfo();

  if (userInfo.isLoading) {
    return null;
  }

  if (!userInfo.data) {
    return null;
  }

  const hasAccess = Array.isArray(permission)
    ? requireAll
      ? hasAllPermissions(permission, userInfo.data.data.accessPerms)
      : hasAnyPermission(permission, userInfo.data.data.accessPerms)
    : hasPermission(permission, userInfo.data.data.accessPerms);

  return hasAccess ? <>{children}</> : <>{fallback}</>;
}
