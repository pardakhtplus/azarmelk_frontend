import { handleApiError } from "@/lib/utils";
import { api } from "@/services/axios-client";
import { type TMutateUser } from "@/types/admin/users/types";
import { type TEditProfileResponse } from "@/types/client/auth/types";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

export default function useEditUser() {
  const editUser = useMutation({
    mutationKey: ["admin", "editUser"],
    mutationFn: async (props: { id: string; data: TMutateUser }) => {
      try {
        const res = await api.admin.management.editUser(props.id, props.data);
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

        const data = (await res.data) as TEditProfileResponse;

        toast.success(data.message);
        return data;
      } catch (error: unknown) {
        toast.error(handleApiError(error, true));
        return null;
      }
    },
  });

  return { editUser };
}
