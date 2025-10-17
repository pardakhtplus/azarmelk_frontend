import { ITrash } from "@/components/Icons";
import { cn } from "@/lib/utils";
import { PlusIcon } from "lucide-react";
import {
  useFieldArray,
  type Control,
  type FieldErrors,
  type UseFormClearErrors,
} from "react-hook-form";
import { type z } from "zod";
import { type mutateEstateSchema } from "../MutateEstate";
import CheckOwnerEstates from "./CheckOwnerEstates";

export default function EstateOwner({
  control,
  categoryId,
  errors,
  clearErrors,
  isUserPanel,
}: {
  control: Control<z.infer<typeof mutateEstateSchema>>;
  categoryId?: string;
  errors: FieldErrors<z.infer<typeof mutateEstateSchema>>;
  clearErrors: UseFormClearErrors<z.infer<typeof mutateEstateSchema>>;
  isUserPanel?: boolean;
}) {
  const owners = useFieldArray({
    control,
    name: "owners",
  });

  return (
    <div className="mt-1 flex flex-col gap-y-3">
      {owners.fields.map((field, index) => (
        <div
          key={field.id}
          className="flex h-14 w-full items-center justify-between rounded-xl border border-primary-blue bg-primary-blue/10 pl-3 pr-4 shadow-sm transition-all duration-300 hover:shadow-md sm:h-16 sm:pl-4 sm:pr-6">
          <div className="flex items-center gap-x-2">
            <p className="text-sm font-medium">
              {field.firstName} {field.lastName}
            </p>
            <p className="text-xs text-gray-500">-</p>
            <p className="text-sm text-gray-600">{field.position || "مالک"}</p>
            <p className="text-xs text-gray-500">-</p>
            <p className="text-sm font-medium">{field.phoneNumber}</p>
            {field.fixPhoneNumber && (
              <>
                <p className="text-xs text-gray-500">-</p>
                <p className="text-sm text-gray-600">{field.fixPhoneNumber}</p>
              </>
            )}
          </div>
          <div className="flex items-center gap-x-1">
            <button
              type="button"
              className="rounded-full p-2 transition-colors hover:bg-red-100"
              onClick={() => {
                owners.remove(index);
              }}>
              <ITrash className="size-5 text-red-500" />
            </button>
          </div>
        </div>
      ))}
      <CheckOwnerEstates
        owners={owners}
        categoryId={categoryId}
        clearErrors={clearErrors}
        className={cn(
          "flex h-14 items-center justify-center gap-x-2 rounded-xl border border-dashed border-primary-blue bg-white px-6 text-primary-blue transition-all duration-300 hover:bg-primary-blue/10 hover:shadow-md sm:h-16",
          errors.owners && "border-red text-red",
        )}
        isUserPanel={isUserPanel}>
        <PlusIcon className="size-5" />
        <span className="text-sm font-medium sm:text-base">
          اضافه کردن شخص جدید
        </span>
      </CheckOwnerEstates>
      {errors.owners && (
        <p className="text-xs text-red">{errors.owners.message}</p>
      )}
    </div>
  );
}
