import { handleApiError } from "@/lib/utils";
import { api } from "@/services/axios-client";
import { type TGetReminderResponse } from "@/types/admin/estate/reminder.types";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function useReminder({
  enabled = true,
  id,
}: {
  enabled?: boolean;
  id: string;
}) {
  const reminder = useQuery({
    queryKey: ["reminder", id],
    queryFn: async () => {
      try {
        const res = await api.admin.reminder.get(id);

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

        const data = res.data as TGetReminderResponse;
        return data;
      } catch (error) {
        toast.error(handleApiError(error, true));
        return null;
      }
    },
    enabled: enabled && !!id,
  });

  return {
    reminder,
  };
}
