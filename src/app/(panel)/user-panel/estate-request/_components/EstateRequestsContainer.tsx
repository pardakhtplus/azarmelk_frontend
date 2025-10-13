"use client";

import EmptyState from "@/components/modules/EmptyState";
import { getCategoryPersianName } from "@/components/modules/estate/ConditionalField";
import { formatNumber } from "@/lib/utils";
import { useUserEstateRequestList } from "@/services/queries/client/dashboard/estate/request/useUserEstateRequestList";
import { type TEstateRequest } from "@/types/client/dashboard/estate/request/types";
import {
  BuildingIcon,
  CalendarIcon,
  DollarSignIcon,
  HomeIcon,
  MapPinIcon,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

// Helper function to format Persian numbers
const toPersianNumber = (num: number | string | undefined): string => {
  if (num === undefined || num === null) return "-";
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return num
    .toString()
    .replace(/\d/g, (digit) => persianDigits[parseInt(digit)]);
};

// Helper function to format price
const formatPrice = (
  price: number | undefined,
  suffix: string = "تومان",
): string => {
  if (!price) return "-";
  const formatted = price.toLocaleString("fa-IR");
  return `${formatted} ${suffix}`;
};

// Helper function to format date
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

// Estate Request Card Component
function EstateRequestCard({ request }: { request: TEstateRequest }) {
  const getMinTotalPrice = () => {
    return request.minTotalPrice ? formatPrice(request.minTotalPrice) : null;
  };

  const getMaxTotalPrice = () => {
    return request.maxTotalPrice ? formatPrice(request.maxTotalPrice) : null;
  };

  const getMinMetragePrice = () => {
    return request.minMetragePrice
      ? formatPrice(request.minMetragePrice, "تومان/متر")
      : null;
  };

  const getMaxMetragePrice = () => {
    return request.maxMetragePrice
      ? formatPrice(request.maxMetragePrice, "تومان/متر")
      : null;
  };

  const getMinEjarePrice = () => {
    return request.minEjarePrice
      ? formatPrice(request.minEjarePrice, "اجاره")
      : null;
  };

  const getMaxEjarePrice = () => {
    return request.maxEjarePrice
      ? formatPrice(request.maxEjarePrice, "اجاره")
      : null;
  };

  const getMinRahnPrice = () => {
    return request.minRahnPrice
      ? formatPrice(request.minRahnPrice, "رهن")
      : null;
  };

  const getMaxRahnPrice = () => {
    return request.maxRahnPrice
      ? formatPrice(request.maxRahnPrice, "رهن")
      : null;
  };

  // Collect all available data
  const availableData: {
    title: string;
    value: string;
    icon: React.ElementType;
  }[] = [];

  const minTotalPrice = getMinTotalPrice();
  if (minTotalPrice) {
    availableData.push({
      title: "حداقل قیمت کل",
      value: formatNumber(minTotalPrice) + " تومان",
      icon: DollarSignIcon,
    });
  }

  const maxTotalPrice = getMaxTotalPrice();
  if (maxTotalPrice) {
    availableData.push({
      title: "حداکثر قیمت کل",
      value: formatNumber(maxTotalPrice) + " تومان",
      icon: DollarSignIcon,
    });
  }

  const minMetragePrice = getMinMetragePrice();
  if (minMetragePrice) {
    availableData.push({
      title: "حداقل قیمت متراژ",
      value: formatNumber(minMetragePrice) + " تومان",
      icon: DollarSignIcon,
    });
  }

  const maxMetragePrice = getMaxMetragePrice();
  if (maxMetragePrice) {
    availableData.push({
      title: "حداکثر قیمت متراژ",
      value: formatNumber(maxMetragePrice) + " تومان",
      icon: DollarSignIcon,
    });
  }

  const minEjarePrice = getMinEjarePrice();
  if (minEjarePrice) {
    availableData.push({
      title: "حداقل قیمت اجاره",
      value: formatNumber(minEjarePrice) + " تومان",
      icon: DollarSignIcon,
    });
  }

  const maxEjarePrice = getMaxEjarePrice();
  if (maxEjarePrice) {
    availableData.push({
      title: "حداکثر قیمت اجاره",
      value: formatNumber(maxEjarePrice) + " تومان",
      icon: DollarSignIcon,
    });
  }

  const minRahnPrice = getMinRahnPrice();
  if (minRahnPrice) {
    availableData.push({
      title: "حداقل قیمت رهن",
      value: formatNumber(minRahnPrice) + " تومان",
      icon: DollarSignIcon,
    });
  }

  const maxRahnPrice = getMaxRahnPrice();
  if (maxRahnPrice) {
    availableData.push({
      title: "حداکثر قیمت رهن",
      value: formatNumber(maxRahnPrice) + " تومان",
      icon: DollarSignIcon,
    });
  }

  return (
    <Link
      href={`/user-panel/estate-request/${request.id}`}
      className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5">
      {/* Main Content */}
      <div className="p-4 sm:p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col-reverse items-start justify-between gap-x-4 gap-y-3 md:flex-row">
            <div className="min-w-0 flex-1">
              <h3 className="mb-2 text-lg font-bold leading-7 text-gray-900 sm:text-xl">
                {request.title}
              </h3>
              {request.description && (
                <p className="leading-6 text-gray-600">{request.description}</p>
              )}
            </div>
            <div className="flex-shrink-0 text-right text-sm text-gray-500">
              <div className="mb-1 flex items-center gap-1">
                <CalendarIcon className="size-4" />
                <span>{formatDate(request.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Category and Type Badges */}
          <div className="flex flex-wrap gap-3 pt-2">
            <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
              <BuildingIcon className="ml-1 size-4" />
              {getCategoryPersianName(request.category.dealType)}
            </span>
            {request.category.propertyType && (
              <span className="inline-flex items-center rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-800">
                <HomeIcon className="ml-1 size-4" />
                {getCategoryPersianName(request.category.propertyType)}
              </span>
            )}
            {request.category.mainCategory && (
              <span className="inline-flex items-center rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-800">
                <HomeIcon className="ml-1 size-4" />
                {getCategoryPersianName(request.category.mainCategory)}
              </span>
            )}
            <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
              <MapPinIcon className="ml-1 size-4" />
              {request.category.name}
            </span>
          </div>
        </div>

        {/* Details Grid - Only show cards with data */}
        {availableData.length > 0 && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {availableData.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div
                  key={index}
                  className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                  <div className="mb-2 flex items-center gap-2">
                    <IconComponent className="size-5 text-gray-600" />
                    <span className="font-semibold text-gray-900">
                      {item.title}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-700">
                    {item.value}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Link>
  );
}

// Loading Skeleton Component
function EstateRequestSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl bg-gradient-to-r from-gray-100 to-gray-200">
      <div className="space-y-4 p-6">
        <div className="h-6 w-3/4 rounded bg-gray-300" />
        <div className="h-4 w-1/2 rounded bg-gray-300" />
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-20 rounded-xl bg-gray-300" />
          ))}
        </div>
      </div>
    </div>
  );
}

export interface ITableField {
  field: string;
  fieldName: string;
  className: string;
  isVisible: boolean;
  order: number;
  isEditable: boolean;
  valueClassName?: string;
}

export default function EstateRequestsContainer() {
  const searchParams = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  const { userEstateRequestList } = useUserEstateRequestList({
    params: {
      page: currentPage,
      limit: pageSize,
      search: searchParams.get("search") || undefined,
    },
  });

  const isLoading = userEstateRequestList.isLoading;
  const data = userEstateRequestList.data;
  const requests = data?.data || [];

  return (
    <div className="space-y-6 pt-10">
      {/* Search */}

      {/* Content */}
      {isLoading ? (
        <div className="flex flex-col gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <EstateRequestSkeleton key={index} />
          ))}
        </div>
      ) : requests.length === 0 ? (
        <EmptyState
          icon={<HomeIcon className="size-8" />}
          title="هیچ درخواست ملکی وجود ندارد"
          description="شما هنوز هیچ درخواست ملکی ثبت نکرده‌اید. برای شروع، درخواست جدیدی ایجاد کنید."
        />
      ) : (
        <>
          <div className="flex flex-col gap-6">
            {requests.map((request) => (
              <EstateRequestCard key={request.id} request={request} />
            ))}
          </div>

          {/* Results Info */}
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>
              نمایش {toPersianNumber((currentPage - 1) * pageSize + 1)} تا{" "}
              {toPersianNumber(
                Math.min(currentPage * pageSize, requests.length),
              )}{" "}
              از {toPersianNumber(requests.length)} درخواست
            </span>
            {requests.length >= pageSize && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}
                  className="rounded-lg border border-gray-200 px-3 py-1 text-sm transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50">
                  قبلی
                </button>
                <span className="px-2">{toPersianNumber(currentPage)}</span>
                <button
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  disabled={requests.length < pageSize}
                  className="rounded-lg border border-gray-200 px-3 py-1 text-sm transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50">
                  بعدی
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
