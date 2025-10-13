import { handleApiError } from "@/lib/utils";
import { api } from "@/services/axios-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export default function useSessionCreateTimeSlot() {
  const queryClient = useQueryClient();

  const createSessionTimeSlot = useMutation({
    mutationKey: ["createSessionTimeSlot"],
    mutationFn: async (props: { title: string; date: string }) => {
      try {
        const res = await api.admin.session.createSessionDate(props);
        if (res.status >= 400) {
          if (res.status === 500) throw new Error(JSON.stringify(res));
          const data = (await res.data) as {
            message: string;
            details: string;
          };
          if (data.message || data.details)
            toast.error(data.message || data.details);
          console.log(data);
          return null;
        }

        const data = (await res.data) as { message: string };

        toast.success(data.message);

        // Invalidate related queries
        queryClient.invalidateQueries({ queryKey: ["sessionDateList"] });

        return data;
      } catch (error: unknown) {
        toast.error(handleApiError(error, true));
        return null;
      }
    },
  });

  return { createSessionTimeSlot };
}
