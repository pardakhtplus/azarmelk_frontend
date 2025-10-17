import { handleApiError } from "@/lib/utils";
import { api } from "@/services/axios-client";
import { type TMutateOwner } from "@/types/admin/owner/types";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

export default function useMutateOwner() {
  const mutateOwner = useMutation({
    mutationKey: ["mutateOwner"],
    mutationFn: async (props: { id?: string; data: TMutateOwner }) => {
      try {
        const res = props.id
          ? await api.admin.owner.edit({ ...props.data, id: props.id })
          : await api.admin.owner.create(props.data);

        if (res.status === 405) {
          const data = (await res.data) as { message: string; id: string };

          return data;
        }

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

        const data = (await res.data) as { message: string; id: string };

        return data;
      } catch (error: unknown) {
        toast.error(handleApiError(error, true));
        return null;
      }
    },
  });

  return { mutateOwner };
}
