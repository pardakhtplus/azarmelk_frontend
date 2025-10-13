import { handleApiError } from "@/lib/utils";
import { api } from "@/services/axios-client";
import { type TMutateSession } from "@/types/admin/session/type";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

export default function useMutateSession() {
  const mutateSession = useMutation({
    mutationKey: ["session", "mutateSession"],
    mutationFn: async (props: TMutateSession) => {
      try {
        const res = props.id
          ? await api.admin.session.edit(props)
          : await api.admin.session.create(props);
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
        return data;
      } catch (error: unknown) {
        toast.error(handleApiError(error, true));
        return null;
      }
    },
  });

  return { mutateSession };
}
