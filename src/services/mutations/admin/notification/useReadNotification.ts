import { handleApiError } from "@/lib/utils";
import { api } from "@/services/axios-client";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

export default function useReadNotification() {
  const readNotification = useMutation({
    mutationKey: ["notification", "readNotification"],
    mutationFn: async (props: { id: string[] }) => {
      try {
        const res = await api.admin.notification.read(props);
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

        return data;
      } catch (error: unknown) {
        toast.error(handleApiError(error, true));
        return null;
      }
    },
  });

  return { readNotification };
}
