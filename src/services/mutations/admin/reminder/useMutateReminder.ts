import { handleApiError } from "@/lib/utils";
import { api } from "@/services/axios-client";
import {
  type TCreateReminder,
  type TEditReminder,
} from "@/types/admin/estate/reminder.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export default function useMutateReminder() {
  const queryClient = useQueryClient();

  const createReminder = useMutation({
    mutationKey: ["createReminder"],
    mutationFn: async (data: TCreateReminder) => {
      try {
        const res = await api.admin.reminder.create(data);
        if (res.status >= 400) {
          if (res.status === 500) throw new Error(JSON.stringify(res));
          const errorData = (await res.data) as {
            message: string;
            details: string;
          };
          if (errorData.message || errorData.details)
            toast.error(errorData.message || errorData.details);
          console.log(errorData);
          return null;
        }

        const responseData = (await res.data) as {
          message: string;
          id: string;
        };
        toast.success(responseData.message || "یادآور با موفقیت ایجاد شد");

        // Invalidate reminder list queries
        queryClient.invalidateQueries({ queryKey: ["reminderList"] });

        return responseData;
      } catch (error: unknown) {
        toast.error(handleApiError(error, true));
        return null;
      }
    },
  });

  const editReminder = useMutation({
    mutationKey: ["editReminder"],
    mutationFn: async (data: TEditReminder) => {
      try {
        const res = await api.admin.reminder.edit(data);
        if (res.status >= 400) {
          if (res.status === 500) throw new Error(JSON.stringify(res));
          const errorData = (await res.data) as {
            message: string;
            details: string;
          };
          if (errorData.message || errorData.details)
            toast.error(errorData.message || errorData.details);
          console.log(errorData);
          return null;
        }

        const responseData = (await res.data) as { message: string };
        toast.success(responseData.message || "یادآور با موفقیت ویرایش شد");

        // Invalidate reminder list queries
        queryClient.invalidateQueries({ queryKey: ["reminderList"] });
        queryClient.invalidateQueries({ queryKey: ["reminder", data.id] });

        return responseData;
      } catch (error: unknown) {
        toast.error(handleApiError(error, true));
        return null;
      }
    },
  });

  const deleteReminder = useMutation({
    mutationKey: ["deleteReminder"],
    mutationFn: async (id: string) => {
      try {
        const res = await api.admin.reminder.delete(id);
        if (res.status >= 400) {
          if (res.status === 500) throw new Error(JSON.stringify(res));
          const errorData = (await res.data) as {
            message: string;
            details: string;
          };
          if (errorData.message || errorData.details)
            toast.error(errorData.message || errorData.details);
          console.log(errorData);
          return null;
        }

        const responseData = (await res.data) as { message: string };
        toast.success(responseData.message || "یادآور با موفقیت حذف شد");

        // Invalidate reminder list queries
        queryClient.invalidateQueries({ queryKey: ["reminderList"] });

        return responseData;
      } catch (error: unknown) {
        toast.error(handleApiError(error, true));
        return null;
      }
    },
  });

  return {
    createReminder,
    editReminder,
    deleteReminder,
  };
}
