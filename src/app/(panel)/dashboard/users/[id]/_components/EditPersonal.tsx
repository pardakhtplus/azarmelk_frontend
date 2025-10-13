import { ICheck, IPenToSquare } from "@/components/Icons";
import BorderedButton from "@/components/modules/buttons/BorderedButton";
import Button from "@/components/modules/buttons/Button";
import CustomSwitch from "@/components/modules/CustomSwitch";
import { FeatureFlag, isFeatureEnabled } from "@/config/features";
import { cn } from "@/lib/utils";
import { canPerform, hasPermission } from "@/permissions/hasPermission";
import { Action, Permissions, Subject } from "@/permissions/permission.types";
import useEditPersonal from "@/services/mutations/admin/users/useEditPersonal";
import { useGetPersonal } from "@/services/queries/admin/users/useGetPersonal";
import { useUserInfo } from "@/services/queries/client/auth/useUserInfo";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { XIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import AccessPerms from "./AccessPerms";
import SelectCategories from "./SelectCategories";

export const personalFormSchema = z.object({
  categories: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      parents: z
        .array(
          z.object({
            id: z.string(),
          }),
        )
        .optional(),
      parentId: z.string().optional(),
    }),
  ),
  accessPerms: z.array(z.nativeEnum(Permissions)),
});

export default function EditPersonal() {
  const { id } = useParams();
  const { personal } = useGetPersonal({ id: id as string });
  const { editPersonal } = useEditPersonal();
  const queryClient = useQueryClient();
  const { userInfo } = useUserInfo();
  const { handleSubmit, watch, setValue, reset } = useForm<
    z.infer<typeof personalFormSchema>
  >({
    resolver: zodResolver(personalFormSchema),
    values: {
      categories:
        personal.data?.data.userPermission?.category.map((category) => ({
          id: category.id,
          name: category.name,
          parents:
            category.parents?.map((parent) => ({
              id: parent.id,
            })) || [],
        })) || [],
      accessPerms:
        personal.data?.data.accessPerms?.filter(
          (perm) => perm !== Permissions.USER,
        ) || [],
    },
  });

  const [isEditingPermissions, setIsEditingProfilePermissions] =
    useState(false);

  const onSubmit = async (data: z.infer<typeof personalFormSchema>) => {
    const res = await editPersonal.mutateAsync({
      id: id as string,
      data: {
        accessPerms: data.accessPerms.includes(Permissions.SUPER_USER)
          ? [Permissions.SUPER_USER]
          : Array.from(new Set([...data.accessPerms])),
        category: data.accessPerms.includes(Permissions.SUPER_USER)
          ? []
          : data.categories
              .filter((category) => {
                if (!category.parents?.length) return true;

                return !category.parents?.some((parent) =>
                  data.categories.some((c) => c.id === parent.id),
                );
              })
              .map((category) => ({
                id: category.id,
              })),
      },
    });

    if (res) {
      setIsEditingProfilePermissions(false);

      queryClient.invalidateQueries({ queryKey: ["personal", id] });
    }
  };

  const handleRoleToggle = (
    role: Permissions,
    subPermission?: Permissions[],
  ) => {
    const isExisted = watch("accessPerms").includes(role);

    if (isExisted) {
      setValue(
        "accessPerms",
        watch("accessPerms")
          .filter((r) => r !== role)
          .filter((r) => !subPermission?.includes(r)),
      );
    } else {
      setValue("accessPerms", [...watch("accessPerms"), role]);
    }
  };

  const isSuperUser = watch("accessPerms").includes(Permissions.SUPER_USER);

  return (
    <div className="mt-16">
      <div className="flex items-center justify-between border-b border-primary-border/30 pb-3">
        <h2 className="text-xl font-medium">دسترسی ها</h2>
        {hasPermission(
          Permissions.OWNER,
          personal.data?.data.accessPerms ?? [],
        ) ? (
          <p className="rounded-md bg-red/10 px-3 py-1 text-sm text-red">
            غیر قابل ویرایش
          </p>
        ) : canPerform(
            Subject.USERS,
            Action.UPDATE,
            userInfo?.data?.data.accessPerms ?? [],
          ) ? (
          isEditingPermissions ? (
            <div className="flex items-center gap-4">
              <BorderedButton
                size="sm"
                className="max-md:!size-11 max-md:!px-0"
                onClick={() => {
                  setIsEditingProfilePermissions(false);
                  reset({
                    categories:
                      personal.data?.data.userPermission?.category.map(
                        (category) => ({
                          id: category.id,
                          name: category.name,
                          parents: category.parents?.map((parent) => ({
                            id: parent.id,
                          })),
                        }),
                      ) || [],
                    accessPerms: personal.data?.data.accessPerms || [],
                  });
                }}>
                <span className="hidden md:block">انصراف</span>
                <XIcon className="block size-6 md:hidden" />
              </BorderedButton>
              <Button
                size="sm"
                spinnerLoading={true}
                className="max-md:!size-11 max-md:!px-0"
                onClick={async () => {
                  await handleSubmit(onSubmit)();
                }}
                isLoading={editPersonal.isPending}>
                <span className="hidden md:block">ثبت تغییرات</span>
                <ICheck className="size-[18px]" />
              </Button>
            </div>
          ) : (
            <>
              <Button
                variant="blue"
                size="sm"
                className="max-md:!size-11 max-md:!px-0"
                onClick={() => setIsEditingProfilePermissions(true)}>
                <span className="hidden md:block">ویرایش</span>
                <IPenToSquare className="size-[18px] md:mr-0.5" />
              </Button>
            </>
          )
        ) : null}
      </div>
      <div
        className={cn(
          "mt-5",
          hasPermission(
            Permissions.OWNER,
            personal.data?.data.accessPerms ?? [],
          ) && "pointer-events-none opacity-60",
        )}>
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div
            className={cn(
              "flex w-full cursor-pointer items-center gap-3 rounded-xl border border-primary-border p-4",
              !isEditingPermissions && "cursor-not-allowed",
            )}
            onClick={() => {
              if (!isEditingPermissions) setIsEditingProfilePermissions(true);

              handleRoleToggle(Permissions.SUPER_USER);
            }}>
            <div className="flex-grow">
              <span
                className={`text-base font-medium ${isSuperUser ? "text-primary" : "text-gray-700"}`}>
                سوپر یوزر
              </span>
            </div>
            <CustomSwitch
              className="flex-shrink-0"
              checked={isSuperUser}
              onChange={() => handleRoleToggle(Permissions.SUPER_USER)}
              disabled={!isEditingPermissions}
            />
          </div>
        </div>
        <div
          className={cn(
            isSuperUser ? "pointer-events-none opacity-50" : "opacity-100",
          )}>
          <AccessPerms
            setIsEditingProfilePermissions={setIsEditingProfilePermissions}
            watch={watch}
            handleRoleToggle={handleRoleToggle}
            isEditingPermissions={isEditingPermissions}
          />
          {isFeatureEnabled(FeatureFlag.CATEGORIES) && (
            <div className="mt-7">
              <span className="font-medium">دسته بندی ها</span>

              <SelectCategories
                watch={watch}
                setValue={setValue}
                setIsEditingProfilePermissions={setIsEditingProfilePermissions}
                isEditingPermissions={isEditingPermissions}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
