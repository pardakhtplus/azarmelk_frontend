export enum Permissions {
  // Estate
  CREATE_ESTATE = "CREATE_ESTATE",
  MANAGE_ESTATE = "MANAGE_ESTATE",
  GET_ESTATE = "GET_ESTATE",
  GET_ESTATE_ADDRESS = "GET_ESTATE_ADDRESS",
  GET_ESTATE_OWNERS = "GET_ESTATE_OWNERS",
  GET_ARCHIVE = "GET_ARCHIVE",

  // Users
  EDIT_USERS = "EDIT_USERS",
  GET_USER = "GET_USER",

  // Categories
  CREATE_CAT = "CREATE_CAT",
  EDIT_CAT = "EDIT_CAT",
  GET_CAT = "GET_CAT",

  // Sessions
  MANAGE_SESSION = "MANAGE_SESSION",
  CREATE_SESSION = "CREATE_SESSION",
  GET_SESSION = "GET_SESSION",

  // Roles
  SUPER_USER = "SUPER_USER",
  USER = "USER",
  OWNER = "OWNER",
}

// Define subject actions
export enum Action {
  CREATE = "create",
  READ = "read",
  UPDATE = "update",
  DELETE = "delete",
  MANAGE = "manage",
}

// Define subjects
export enum Subject {
  ESTATES = "estates",
  USERS = "users",
  CATEGORIES = "categories",
  LANDINGS = "landings",
  SUPERUSERS = "superusers",
  SESSIONS = "sessions",
}

// Define permission object type
export interface PermissionObject {
  name: string;
  description: string;
  permissions: Permissions;
  subPermissions?: PermissionObject[];
}
