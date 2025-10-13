import { useUserInfo } from "@/services/queries/client/auth/useUserInfo";
import { canPerform } from "./hasPermission";
import { type Action, type Subject } from "./permission.types";

export function useAbility() {
  const { userInfo } = useUserInfo();

  const can = (action: Action, subject: Subject): boolean => {
    if (!userInfo.data) return false;
    return canPerform(subject, action, userInfo.data.data.accessPerms);
  };

  return { can };
}
