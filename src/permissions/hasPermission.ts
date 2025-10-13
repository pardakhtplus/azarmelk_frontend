import { Permissions, Action, Subject } from "./permission.types";

// Map permissions to subject actions
const permissionMap: Record<
  Permissions,
  Array<{ subject: Subject; action: Action }>
> = {
  // ROLES
  [Permissions.OWNER]: [
    { subject: Subject.ESTATES, action: Action.MANAGE },
    { subject: Subject.USERS, action: Action.MANAGE },
    { subject: Subject.CATEGORIES, action: Action.MANAGE },
    { subject: Subject.LANDINGS, action: Action.MANAGE },
    { subject: Subject.SUPERUSERS, action: Action.MANAGE },
  ],
  [Permissions.SUPER_USER]: [
    { subject: Subject.ESTATES, action: Action.MANAGE },
    { subject: Subject.USERS, action: Action.MANAGE },
    { subject: Subject.CATEGORIES, action: Action.MANAGE },
    { subject: Subject.LANDINGS, action: Action.MANAGE },
  ],

  [Permissions.USER]: [],

  // PERMISSIONS
  [Permissions.CREATE_ESTATE]: [
    { subject: Subject.ESTATES, action: Action.CREATE },
    { subject: Subject.ESTATES, action: Action.READ },
  ],
  [Permissions.MANAGE_ESTATE]: [
    { subject: Subject.ESTATES, action: Action.MANAGE },
  ],
  [Permissions.GET_ESTATE]: [{ subject: Subject.ESTATES, action: Action.READ }],
  [Permissions.GET_ESTATE_ADDRESS]: [],
  [Permissions.GET_ESTATE_OWNERS]: [],
  [Permissions.EDIT_USERS]: [{ subject: Subject.USERS, action: Action.UPDATE }],
  [Permissions.GET_USER]: [{ subject: Subject.USERS, action: Action.READ }],
  [Permissions.CREATE_CAT]: [
    { subject: Subject.CATEGORIES, action: Action.CREATE },
  ],
  [Permissions.EDIT_CAT]: [
    { subject: Subject.CATEGORIES, action: Action.UPDATE },
  ],
  [Permissions.GET_CAT]: [{ subject: Subject.CATEGORIES, action: Action.READ }],
  [Permissions.CREATE_SESSION]: [
    { subject: Subject.SESSIONS, action: Action.CREATE },
    { subject: Subject.SESSIONS, action: Action.READ },
  ],
  [Permissions.MANAGE_SESSION]: [
    { subject: Subject.SESSIONS, action: Action.MANAGE },
  ],
  [Permissions.GET_SESSION]: [
    { subject: Subject.SESSIONS, action: Action.READ },
  ],
  [Permissions.GET_ARCHIVE]: [
    { subject: Subject.ESTATES, action: Action.READ },
  ],
};

// Check single permission
export function hasPermission(
  permission: Permissions,
  userAccessPerms: Permissions[],
): boolean {
  return userAccessPerms?.includes(permission) ?? false;
}

// Check if user has any of the permissions
export function hasAnyPermission(
  permissions: Permissions[],
  userAccessPerms: Permissions[],
): boolean {
  return permissions.some((permission) =>
    userAccessPerms?.includes(permission),
  );
}

// Check if user has all permissions
export function hasAllPermissions(
  permissions: Permissions[],
  userAccessPerms: Permissions[],
): boolean {
  return permissions.every((permission) =>
    userAccessPerms?.includes(permission),
  );
}

// Check permission for specific subject and action
export function canPerform(
  subject: Subject,
  action: Action,
  accessPerms: Permissions[],
): boolean {
  // Special case: if user has superuser, they can do anything
  if (
    accessPerms?.includes(Permissions.SUPER_USER) ||
    accessPerms?.includes(Permissions.OWNER)
  ) {
    return true;
  }

  // Check each permission the user has
  for (const permission of accessPerms ?? []) {
    const allowedActions = permissionMap[permission];

    // Check if any of the allowed actions match the requested subject and action
    const canDo = allowedActions.some((allowed) => {
      // Exact match
      if (
        allowed.subject === subject &&
        (allowed.action === action || allowed.action === Action.MANAGE)
      ) {
        return true;
      }
      return false;
    });

    if (canDo) return true;
  }

  return false;
}
