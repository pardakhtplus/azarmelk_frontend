import { handleApiError } from "@/lib/utils";
import { api } from "@/services/axios-client";
import { type TSessionNoteListResponse } from "@/types/admin/session/note/types";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function useSessionNoteList(params: { id: string }) {
  const sessionNoteList = useQuery({
    queryKey: ["sessionNoteList", params.id],
    queryFn: async () => {
      try {
        const res = await api.admin.session.note.getList(params);

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

        const data = res.data as TSessionNoteListResponse;

        return data;
      } catch (error) {
        toast.error(handleApiError(error, true));

        return null;
      }
    },
  });

  return {
    sessionNoteList,
  };
}
