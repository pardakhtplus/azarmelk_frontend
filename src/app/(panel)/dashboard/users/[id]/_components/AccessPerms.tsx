import { FeatureFlag, isFeatureEnabled } from "@/config/features";
import { cn } from "@/lib/utils";
import {
  Permissions,
  type PermissionObject,
} from "@/permissions/permission.types";
import { type UseFormWatch } from "react-hook-form";
import toast from "react-hot-toast";
import { type z } from "zod";
import { type personalFormSchema } from "./EditPersonal";

const accessPerms = {
  ...(isFeatureEnabled(FeatureFlag.CATEGORIES) && {
    "دسته بندی ها": [
      {
        name: "ایجاد دسته بندی",
        description: "ایجاد دسته بندی",
        permissions: Permissions.CREATE_CAT,
      },
      {
        name: "ویرایش دسته بندی",
        description: "ویرایش دسته بندی",
        permissions: Permissions.EDIT_CAT,
      },
      {
        name: "مشاهده دسته بندی",
        description: "مشاهده دسته بندی",
        permissions: Permissions.GET_CAT,
      },
    ],
  }),
  ...(isFeatureEnabled(FeatureFlag.USERS) && {
    کاربران: [
      {
        name: "ویرایش کاربر",
        description: "ویرایش کاربر",
        permissions: Permissions.EDIT_USERS,
      },
      {
        name: "مشاهده کاربر",
        description: "مشاهده کاربر",
        permissions: Permissions.GET_USER,
      },
    ],
  }),
  ...(isFeatureEnabled(FeatureFlag.ESTATES) && {
    "فایل ها": [
      {
        name: "مشاهده فایل",
        description: "مشاهده فایل",
        permissions: Permissions.GET_ESTATE,
        subPermissions: [
          {
            name: "مشاهده مالک",
            description: "مشاهده مالک",
            permissions: Permissions.GET_ESTATE_OWNERS,
          },
          {
            name: "مشاهده آدرس",
            description: "مشاهده آدرس",
            permissions: Permissions.GET_ESTATE_ADDRESS,
          },
        ],
      },
      {
        name: "ایجاد فایل",
        description: "ایجاد فایل",
        permissions: Permissions.CREATE_ESTATE,
      },
      {
        name: "مدیریت فایل",
        description: "مدیریت‍ فایل",
        permissions: Permissions.MANAGE_ESTATE,
      },
      {
        name: "مشاهده فایل های آرشیو",
        description: "مشاهده فایل های آرشیو",
        permissions: Permissions.GET_ARCHIVE,
      },
    ],
  }),
  ...(isFeatureEnabled(FeatureFlag.SESSIONS) && {
    جلسات: [
      {
        name: "ایجاد جلسه",
        description: "ایجاد جلسه",
        permissions: Permissions.CREATE_SESSION,
      },
      {
        name: "مدیریت جلسه",
        description: "ویرایش جلسه",
        permissions: Permissions.MANAGE_SESSION,
      },
      {
        name: "مشاهده جلسه",
        description: "مشاهده جلسه",
        permissions: Permissions.GET_SESSION,
      },
    ],
  }),
};

export default function AccessPerms({
  setIsEditingProfilePermissions,
  watch,
  handleRoleToggle,
  isEditingPermissions,
}: {
  setIsEditingProfilePermissions: (
    isEditingProfilePermissions: boolean,
  ) => void;
  watch: UseFormWatch<z.infer<typeof personalFormSchema>>;
  handleRoleToggle: (role: Permissions, subPermission?: Permissions[]) => void;
  isEditingPermissions: boolean;
}) {
  return (
    <div
      className={cn(
        "mt-7 grid grid-cols-1 gap-4 xs:grid-cols-2 sm:gap-6 md:grid-cols-3 xl:grid-cols-4",
      )}>
      {Object.keys(accessPerms).map((key) => (
        <AccessPermSection
          key={key}
          name={key}
          setIsEditingProfilePermissions={setIsEditingProfilePermissions}
          watch={watch}
          handleRoleToggle={handleRoleToggle}
          isEditingPermissions={isEditingPermissions}
        />
      ))}
    </div>
  );
}

function AccessPermSection({
  name,
  setIsEditingProfilePermissions,
  watch,
  handleRoleToggle,
  isEditingPermissions,
}: {
  name: string;
  setIsEditingProfilePermissions: (
    isEditingProfilePermissions: boolean,
  ) => void;
  watch: UseFormWatch<z.infer<typeof personalFormSchema>>;
  handleRoleToggle: (role: Permissions, subPermission?: Permissions[]) => void;
  isEditingPermissions: boolean;
}) {
  const permissions: PermissionObject[] | undefined =
    accessPerms[name as keyof typeof accessPerms];

  const isAllSelected = permissions?.every((permission) => {
    return watch("accessPerms").includes(permission.permissions);
  });

  return (
    <div className="h-full w-full rounded-lg border border-primary-border p-4">
      <div className="flex items-center justify-between">
        <p className="font-medium">{name}</p>
        <div
          className="cntr"
          onClick={() => {
            if (!isEditingPermissions) setIsEditingProfilePermissions(true);
          }}>
          <input
            type="checkbox"
            id={`cbx-${name}`}
            className="checkbox hidden-xs-up"
            checked={isAllSelected}
            onChange={(event) => {
              if (event.target.checked) {
                for (const permission of permissions || []) {
                  const isSelected = watch("accessPerms").includes(
                    permission.permissions,
                  );
                  if (!isSelected) {
                    handleRoleToggle(
                      permission.permissions,
                      permission.subPermissions?.map(
                        (subPermission) => subPermission.permissions,
                      ),
                    );
                  }
                }
              } else {
                for (const permission of permissions || []) {
                  const isSelected = watch("accessPerms").includes(
                    permission.permissions,
                  );
                  if (isSelected) {
                    handleRoleToggle(
                      permission.permissions,
                      permission.subPermissions?.map(
                        (subPermission) => subPermission.permissions,
                      ),
                    );
                  }
                }
              }
            }}
          />
          <label htmlFor={`cbx-${name}`} className="cbx" />
        </div>
      </div>
      <div className="flex flex-col gap-4 pb-1 pt-5 transition-all duration-300 ease-in-out">
        {permissions?.map((permission) => {
          return (
            <PermissionItem
              key={permission.name}
              permission={permission}
              setIsEditingProfilePermissions={setIsEditingProfilePermissions}
              isEditingPermissions={isEditingPermissions}
              watch={watch}
              handleRoleToggle={handleRoleToggle}
              canEdit={true}
            />
          );
        })}
      </div>
    </div>
  );
}

function PermissionItem({
  permission,
  setIsEditingProfilePermissions,
  isEditingPermissions,
  watch,
  handleRoleToggle,
  isSubPermission,
  canEdit = true,
  parentPermission,
}: {
  permission: PermissionObject;
  setIsEditingProfilePermissions: (
    isEditingProfilePermissions: boolean,
  ) => void;
  isEditingPermissions: boolean;
  watch: UseFormWatch<z.infer<typeof personalFormSchema>>;
  handleRoleToggle: (role: Permissions, subPermission?: Permissions[]) => void;
  isSubPermission?: boolean;
  canEdit?: boolean;
  parentPermission?: PermissionObject;
}) {
  return (
    <>
      <div
        key={permission.name}
        className={cn(
          "flex items-center gap-3",
          isSubPermission && "border-r-2 border-gray-200 pr-4",
        )}>
        <div
          className="cntr"
          onClick={() => {
            if (!isEditingPermissions) setIsEditingProfilePermissions(true);
          }}>
          <input
            type="checkbox"
            id={`cbx-${permission.name}`}
            className="checkbox hidden-xs-up"
            checked={watch("accessPerms").includes(permission.permissions)}
            onChange={() => {
              if (parentPermission) {
                const isParentSelected = watch("accessPerms").includes(
                  parentPermission?.permissions,
                );
                if (isParentSelected) {
                  handleRoleToggle(
                    permission.permissions,
                    ...(!isSubPermission
                      ? [
                          permission.subPermissions?.map(
                            (subPermission) => subPermission.permissions,
                          ),
                        ]
                      : []),
                  );

                  return;
                } else {
                  toast.error(
                    `باید دسترسی "${parentPermission?.name}" را انتخاب کنید`,
                  );

                  return;
                }
              }

              if (canEdit)
                handleRoleToggle(
                  permission.permissions,
                  permission.subPermissions?.map(
                    (subPermission) => subPermission.permissions,
                  ),
                );
            }}
          />
          <label htmlFor={`cbx-${permission.name}`} className="cbx" />
        </div>
        <span
          className={cn(
            "text-sm",
            isSubPermission ? "text-gray-500" : "text-gray-700",
          )}>
          {permission.name}
        </span>
      </div>
      {permission.subPermissions && (
        <div className="flex flex-col gap-4">
          {permission.subPermissions.map((subPermission) => (
            <PermissionItem
              key={subPermission.name}
              parentPermission={permission}
              permission={subPermission}
              setIsEditingProfilePermissions={setIsEditingProfilePermissions}
              isEditingPermissions={isEditingPermissions}
              watch={watch}
              handleRoleToggle={handleRoleToggle}
              isSubPermission={true}
              canEdit={watch("accessPerms").includes(permission.permissions)}
            />
          ))}
        </div>
      )}
    </>
  );
}
