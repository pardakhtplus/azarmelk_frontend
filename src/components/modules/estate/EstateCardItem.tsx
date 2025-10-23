"use client";

import { IBuildingLight, ILocationDotLight, IToman } from "@/components/Icons";
import {
  getDefaultPosterFileByCategory,
  getStatusInfo,
} from "@/components/modules/estate/EstateUtils";
import { ESTATE_STATUS } from "@/enums";
import { type PropertyTypeEnum } from "@/lib/categories";
import { cn } from "@/lib/utils";
import { Permissions } from "@/permissions/permission.types";
import { useUserInfo } from "@/services/queries/client/auth/useUserInfo";
import { type TEstate } from "@/types/types";
import { ImageOffIcon } from "lucide-react";
import { toast } from "react-hot-toast";
import CustomImage from "../CustomImage";

interface Props {
  estate: TEstate;
  children?: React.ReactNode;
  showCompletionPercentage?: boolean;
  isWebsite?: boolean;
}

export default function EstateCardItem({
  estate,
  children,
  showCompletionPercentage,
  isWebsite,
}: Props) {
  const { userInfo } = useUserInfo();
  const statusInfo = getStatusInfo(estate.status, estate.archiveStatus);

  const isAdvisor =
    userInfo.data?.data.phoneNumber &&
    !userInfo.data?.data.accessPerms.includes(Permissions.USER);

  return (
    <div
      suppressHydrationWarning
      className="group relative flex h-full w-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-primary-border bg-white transition-all duration-300 hover:border-primary/20"
      onClick={() => {
        if (
          (estate.status === ESTATE_STATUS.PUBLISH ||
            userInfo?.data?.data.accessPerms.includes(Permissions.SUPER_USER) ||
            userInfo?.data?.data.accessPerms.includes(Permissions.OWNER) ||
            userInfo?.data?.data.accessPerms.includes(
              Permissions.MANAGE_ESTATE,
            ) ||
            isAdvisor ||
            estate.status === undefined) &&
          !isWebsite
        ) {
          window.open(`/estates/${estate.id}`, "_blank");
        }
      }}>
      {children}

      <div className="relative aspect-[16/11] w-full shrink-0 overflow-hidden">
        {estate.posterFile?.url ||
        getDefaultPosterFileByCategory({
          propertyType: estate.category.propertyType as PropertyTypeEnum,
        }) ? (
          <CustomImage
            src={
              estate.posterFile?.url ||
              getDefaultPosterFileByCategory({
                propertyType: estate.category.propertyType as PropertyTypeEnum,
              })
            }
            alt={estate.title}
            width={400}
            height={300}
            className="size-full rounded-t-2xl object-cover transition-transform duration-300 group-hover:scale-105"
            priority
          />
        ) : (
          <div className="flex size-full items-center justify-center rounded-t-2xl bg-gray-200">
            <ImageOffIcon className="size-10 text-gray-400" />
          </div>
        )}
        {/* Status badge */}
        {statusInfo ? (
          <div className="absolute right-3 top-3 flex flex-col gap-1.5">
            <span
              className={cn(
                "inline-flex w-fit items-center rounded-full px-2 py-1 text-xs font-medium backdrop-blur-sm",
                statusInfo?.mainStatus?.bgColor,
                statusInfo?.mainStatus?.textColor,
              )}>
              {statusInfo?.mainStatus?.label}
            </span>
          </div>
        ) : null}
        {isAdvisor && estate.estateCode ? (
          <div
            className="absolute bottom-2 right-2 w-fit cursor-text rounded-sm bg-neutral-200/70 px-2 py-0.5 text-xs text-black"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();

              navigator.clipboard.writeText(estate.estateCode.toString());
              toast.success("کد ملک با موفقیت کپی شد");
            }}>
            <p className="-mb-px">{estate.estateCode}</p>
          </div>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col justify-between p-3 sm:p-4">
        <div className="space-y-2">
          <h2 className="line-clamp-2 text-sm font-semibold leading-5 text-gray-900 sm:text-base">
            {estate.title}
          </h2>
        </div>

        <div className="mt-3">
          {/* Property details */}
          <div className="flex items-center justify-between gap-3 text-xs text-gray-600 sm:text-sm">
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <ILocationDotLight className="size-[18px] shrink-0" />
              <span className="line-clamp-1">{estate.approximateAddress}</span>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <IBuildingLight className="size-[17px] shrink-0" />
              <span>{estate.metrage || 0} متر</span>
            </div>
          </div>
          {/* Price section */}
          <div className="mt-3 space-y-1 border-t border-primary-border/50 pt-2">
            {estate.totalPrice && estate.metragePrice ? (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-600 sm:text-sm">
                    قیمت کل:
                  </span>
                  <span className="flex items-center text-sm font-bold text-primary sm:text-base">
                    {Intl.NumberFormat("fa-IR").format(estate.totalPrice || 0)}{" "}
                    <IToman className="size-[18px]" />
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-600 sm:text-sm">
                    قیمت هر متر:
                  </span>
                  <span className="flex items-center text-xs font-semibold text-gray-700 sm:text-sm">
                    {Intl.NumberFormat("fa-IR").format(
                      estate.metragePrice || 0,
                    )}{" "}
                    <IToman className="size-[18px]" />
                  </span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-600 sm:text-sm">
                    قیمت رهن:
                  </span>
                  <span className="flex items-center text-sm font-bold text-primary sm:text-base">
                    {Intl.NumberFormat("fa-IR").format(estate.rahnPrice || 0)}{" "}
                    <IToman className="size-[18px]" />
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-600 sm:text-sm">
                    قیمت اجاره:
                  </span>
                  <span className="flex items-center text-xs font-semibold text-gray-700 sm:text-sm">
                    {Intl.NumberFormat("fa-IR").format(estate.ejarePrice || 0)}{" "}
                    <IToman className="size-[18px]" />
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Completion Progress Bar */}
          {showCompletionPercentage && estate.percentage && (
            <div className="mt-3 space-y-2 border-t border-primary-border/50 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-600">
                  وضعیت تکمیل
                </span>
                <span className="text-xs font-semibold text-primary">
                  {estate.percentage}%
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-200">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-green-500 to-blue-500 transition-all duration-300"
                  style={{ width: `${estate.percentage}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
