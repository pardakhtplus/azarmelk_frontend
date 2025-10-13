import { handleApiError } from "@/lib/utils";
import { api } from "@/services/axios-client";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

export default function useMutateEstateNote() {
  const mutateEstateNote = useMutation({
    mutationKey: ["estate", "mutateEstateNote"],
    mutationFn: async (props: {
      id?: string;
      note: string;
      estateId?: string;
    }) => {
      try {
        const res = props.id
          ? await api.admin.estate.note.edit({
              id: props.id!,
              note: props.note,
            })
          : await api.admin.estate.note.create({
              id: props.estateId!,
              note: props.note,
            });
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

  return { mutateEstateNote };
}
