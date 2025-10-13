import { handleApiError } from "@/lib/utils";
import { api } from "@/services/axios-client";
import {
  type TGetReminderListResponse,
  type TReminderListParams,
} from "@/types/admin/estate/reminder.types";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function useReminderList({
  enabled = true,
  params,
}: {
  enabled?: boolean;
  params?: TReminderListParams;
}) {
  const reminderList = useQuery({
    queryKey: ["reminderList", params],
    queryFn: async () => {
      try {
        const res = await api.admin.reminder.getList(params);

        if (res.status >= 400) {
          if (res.status === 500) throw new Error(JSON.stringify(res));
          const data = res.data as {
            message: string;
            details: string;
          };
          if (data.message || data.details)
            toast.error(data.message || data.details);
          console.log(data);
          return null;
        }

        const data = res.data as TGetReminderListResponse;
        return data;
      } catch (error) {
        toast.error(handleApiError(error, true));
        return null;
      }
    },
    enabled,
  });

  return {
    reminderList,
  };
}
