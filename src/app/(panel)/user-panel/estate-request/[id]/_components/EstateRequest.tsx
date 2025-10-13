"use client";

import { getCategoryPersianName } from "@/components/modules/estate/ConditionalField";
import { formatNumber } from "@/lib/utils";
import { useUserEstateRequest } from "@/services/queries/client/dashboard/estate/request/useUserEstateRequest";
import {
  BuildingIcon,
  CalendarIcon,
  ClockIcon,
  DollarSignIcon,
  HomeIcon,
  LayersIcon,
  MapPinIcon,
  RulerIcon,
} from "lucide-react";
import { useParams } from "next/navigation";
import AmenityTag from "./AmenityTag";

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
  return `${formatNumber(formatted)} ${suffix}`;
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

export default function EstateRequest() {
  const params = useParams();
  const requestId = params.id as string;

  const { userEstateRequest } = useUserEstateRequest({
    id: requestId,
  });

  // ایجاد آرایه امکانات از فیلدهای estate
  const createAmenitiesArray = () => {
    const amenitiesMap = new Map<string, string[]>();

    // استفاده از ساختار جدید properties
    const properties = userEstateRequest.data?.data?.properties;

    if (!properties) return [];

    // استفاده از ساختار جدید که شامل title، mainTitle و values است
    Object.entries(properties).forEach(([_, property]) => {
      if (
        property &&
        typeof property === "object" &&
        "title" in property &&
        "mainTitle" in property &&
        "values" in property
      ) {
        if (
          property.values &&
          Array.isArray(property.values) &&
          property.values.length > 0
        ) {
          // ترکیب mainTitle و title برای نمایش کامل
          // مثال: "ویژگی‌های معماری/سبک دوبلکس"
          let displayTitle = property.mainTitle;
          if (property.title && property.title !== property.mainTitle) {
            displayTitle = `${property.mainTitle}/${property.title}`;
          }
          if (property.title === "مقدار وام") {
            amenitiesMap.set(displayTitle, [
              `${Number(property.values[0]).toLocaleString("fa-IR")} تومان`,
            ]);
          } else amenitiesMap.set(displayTitle, property.values);
        }
      }
    });

    // تبدیل Map به آرایه
    const amenities: { label: string; values: string[] }[] = [];
    amenitiesMap.forEach((values, label) => {
      amenities.push({ label, values });
    });

    return amenities;
  };

  const estateAmenities = createAmenitiesArray();

  if (userEstateRequest.isLoading) {
    return (
      <div className="space-y-6 pt-10">
        <div className="animate-pulse">
          <div className="mb-4 h-8 w-1/3 rounded bg-gray-300" />
          <div className="mb-6 h-4 w-1/2 rounded bg-gray-300" />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-32 rounded-xl bg-gray-300" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!userEstateRequest?.data) {
    return (
      <div className="flex items-center justify-center pt-20">
        <div className="text-center">
          <HomeIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            درخواست یافت نشد
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            درخواست مورد نظر یافت نشد یا حذف شده است.
          </p>
        </div>
      </div>
    );
  }

  const request = userEstateRequest.data;

  return (
    <div className="space-y-6 pt-10">
      {/* Header */}
      <div className="rounded-2xl border-gray-200 bg-white p-0 shadow-sm sm:border sm:p-6">
        <div className="flex flex-col-reverse items-start justify-between gap-4 md:flex-row">
          <div className="min-w-0 flex-1">
            <h1 className="mb-2 text-lg font-bold text-gray-900 sm:text-2xl">
              {request.data.title}
            </h1>
            {request.data.description && (
              <p className="mb-4 leading-6 text-gray-600">
                {request.data.description}
              </p>
            )}

            {/* Category and Type Badges */}
            <div className="flex flex-wrap gap-3 pt-2">
              <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
                <BuildingIcon className="ml-1 size-4" />
                {getCategoryPersianName(request.data.category.dealType)}
              </span>
              {request.data.category.propertyType && (
                <span className="inline-flex items-center rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-800">
                  <HomeIcon className="ml-1 size-4" />
                  {getCategoryPersianName(request.data.category.propertyType)}
                </span>
              )}
              {request.data.category.mainCategory && (
                <span className="inline-flex items-center rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-800">
                  <HomeIcon className="ml-1 size-4" />
                  {getCategoryPersianName(request.data.category.mainCategory)}
                </span>
              )}
              <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                <MapPinIcon className="ml-1 size-4" />
                {request.data.category.name}
              </span>
            </div>
          </div>

          <div className="flex-shrink-0 text-right text-sm text-gray-500">
            <div className="mb-1 flex items-center gap-1">
              <CalendarIcon className="size-4" />
              <span>{formatDate(request.data.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Price Information */}
      {request.data.minTotalPrice ||
      request.data.maxTotalPrice ||
      request.data.minMetragePrice ||
      request.data.maxMetragePrice ||
      request.data.minEjarePrice ||
      request.data.maxEjarePrice ||
      request.data.minRahnPrice ||
      request.data.maxRahnPrice ? (
        <div className="rounded-2xl border-gray-200 bg-white p-0 shadow-sm sm:border sm:p-6">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
            <DollarSignIcon className="size-5 text-green-600" />
            اطلاعات قیمت
          </h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Total Price */}
            {(request.data.minTotalPrice || request.data.maxTotalPrice) && (
              <>
                {request.data.minTotalPrice && (
                  <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <DollarSignIcon className="size-5 text-gray-600" />
                      <span className="font-semibold text-gray-900">
                        حداقل قیمت کل
                      </span>
                    </div>
                    <p className="text-lg font-medium text-gray-600">
                      {formatPrice(request.data.minTotalPrice)}
                    </p>
                  </div>
                )}
                {request.data.maxTotalPrice && (
                  <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <DollarSignIcon className="size-5 text-gray-600" />
                      <span className="font-semibold text-gray-900">
                        حداکثر قیمت کل
                      </span>
                    </div>
                    <p className="text-lg font-medium text-gray-600">
                      {formatPrice(request.data.maxTotalPrice)}
                    </p>
                  </div>
                )}
              </>
            )}

            {/* Metrage Price */}
            {(request.data.minMetragePrice || request.data.maxMetragePrice) && (
              <>
                {request.data.minMetragePrice && (
                  <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <DollarSignIcon className="size-5 text-gray-600" />
                      <span className="font-semibold text-gray-900">
                        حداقل قیمت متراژ
                      </span>
                    </div>
                    <p className="text-lg font-medium text-gray-600">
                      {formatPrice(request.data.minMetragePrice, "تومان/متر")}
                    </p>
                  </div>
                )}
                {request.data.maxMetragePrice && (
                  <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <DollarSignIcon className="size-5 text-gray-600" />
                      <span className="font-semibold text-gray-900">
                        حداکثر قیمت متراژ
                      </span>
                    </div>
                    <p className="text-lg font-medium text-gray-600">
                      {formatPrice(request.data.maxMetragePrice, "تومان/متر")}
                    </p>
                  </div>
                )}
              </>
            )}

            {/* Rent Price */}
            {(request.data.minEjarePrice || request.data.maxEjarePrice) && (
              <>
                {request.data.minEjarePrice && (
                  <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <DollarSignIcon className="size-5 text-gray-600" />
                      <span className="font-semibold text-gray-900">
                        حداقل قیمت اجاره
                      </span>
                    </div>
                    <p className="text-lg font-medium text-gray-600">
                      {formatPrice(request.data.minEjarePrice, "اجاره")}
                    </p>
                  </div>
                )}
                {request.data.maxEjarePrice && (
                  <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <DollarSignIcon className="size-5 text-gray-600" />
                      <span className="font-semibold text-gray-900">
                        حداکثر قیمت اجاره
                      </span>
                    </div>
                    <p className="text-lg font-medium text-gray-600">
                      {formatPrice(request.data.maxEjarePrice, "اجاره")}
                    </p>
                  </div>
                )}
              </>
            )}

            {/* Deposit Price */}
            {(request.data.minRahnPrice || request.data.maxRahnPrice) && (
              <>
                {request.data.minRahnPrice && (
                  <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <DollarSignIcon className="size-5 text-gray-600" />
                      <span className="font-semibold text-gray-900">
                        حداقل قیمت رهن
                      </span>
                    </div>
                    <p className="text-lg font-medium text-gray-600">
                      {formatPrice(request.data.minRahnPrice, "رهن")}
                    </p>
                  </div>
                )}
                {request.data.maxRahnPrice && (
                  <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <DollarSignIcon className="size-5 text-gray-600" />
                      <span className="font-semibold text-gray-900">
                        حداکثر قیمت رهن
                      </span>
                    </div>
                    <p className="text-lg font-medium text-gray-600">
                      {formatPrice(request.data.maxRahnPrice, "رهن")}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      ) : null}

      {/* Property Details */}
      <div className="rounded-2xl border-gray-200 bg-white p-0 shadow-sm sm:border sm:p-6">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
          <HomeIcon className="size-5 text-blue-600" />
          جزئیات ملک
        </h2>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Metrage */}
          {request.data.minMetrage || request.data.maxMetrage ? (
            <>
              {request.data.minMetrage ? (
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <RulerIcon className="size-5 text-gray-600" />
                    <span className="font-semibold text-gray-900">
                      حداقل متراژ
                    </span>
                  </div>
                  <p className="text-lg font-medium text-gray-600">
                    {toPersianNumber(request.data.minMetrage)} متر
                  </p>
                </div>
              ) : null}
              {request.data.maxMetrage ? (
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <RulerIcon className="size-5 text-gray-600" />
                    <span className="font-semibold text-gray-900">
                      حداکثر متراژ
                    </span>
                  </div>
                  <p className="text-lg font-medium text-gray-600">
                    {toPersianNumber(request.data.maxMetrage)} متر
                  </p>
                </div>
              ) : null}
            </>
          ) : null}

          {/* Room Count */}
          {request.data.roomCount ? (
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <div className="mb-2 flex items-center gap-2">
                <HomeIcon className="size-5 text-gray-600" />
                <span className="font-semibold text-gray-900">تعداد اتاق</span>
              </div>
              <p className="text-lg font-medium text-gray-600">
                {toPersianNumber(request.data.roomCount)}
              </p>
            </div>
          ) : null}

          {/* Build Year */}
          {request.data.buildYear ? (
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <div className="mb-2 flex items-center gap-2">
                <CalendarIcon className="size-5 text-gray-600" />
                <span className="font-semibold text-gray-900">سال ساخت</span>
              </div>
              <p className="text-lg font-medium text-gray-600">
                {toPersianNumber(request.data.buildYear)}
              </p>
            </div>
          ) : null}

          {/* Build Year */}
          {request.data.location?.length ? (
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <div className="mb-2 flex items-center gap-2">
                <CalendarIcon className="size-5 text-gray-600" />
                <span className="font-semibold text-gray-900">موقعیت ملک</span>
              </div>
              <p className="text-lg font-medium text-gray-600">
                {request.data.location.join(", ")}
              </p>
            </div>
          ) : null}

          {request.data.dahaneMetrage ? (
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <div className="mb-2 flex items-center gap-2">
                <CalendarIcon className="size-5 text-gray-600" />
                <span className="font-semibold text-gray-900">متراژ دهنه</span>
              </div>
              <p className="text-lg font-medium text-gray-600">
                {toPersianNumber(request.data.dahaneMetrage)} متر
              </p>
            </div>
          ) : null}

          {request.data.floorCount ? (
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <div className="mb-2 flex items-center gap-2">
                <CalendarIcon className="size-5 text-gray-600" />
                <span className="font-semibold text-gray-900">
                  تعداد کل طبقات
                </span>
              </div>
              <p className="text-lg font-medium text-gray-600">
                {toPersianNumber(request.data.floorCount)}
              </p>
            </div>
          ) : null}

          {request.data.floorUnitCount ? (
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <div className="mb-2 flex items-center gap-2">
                <CalendarIcon className="size-5 text-gray-600" />
                <span className="font-semibold text-gray-900">
                  تعداد واحد در طبقه
                </span>
              </div>
              <p className="text-lg font-medium text-gray-600">
                {toPersianNumber(request.data.floorUnitCount)}
              </p>
            </div>
          ) : null}

          {request.data.height ? (
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <div className="mb-2 flex items-center gap-2">
                <CalendarIcon className="size-5 text-gray-600" />
                <span className="font-semibold text-gray-900">ارتفاع سقف</span>
              </div>
              <p className="text-lg font-medium text-gray-600">
                {toPersianNumber(request.data.height)} متر
              </p>
            </div>
          ) : null}

          {/* Floor Range */}
          {request.data.minFloor || request.data.maxFloor ? (
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <div className="mb-2 flex items-center gap-2">
                <LayersIcon className="size-5 text-gray-600" />
                <span className="font-semibold text-gray-900">طبقه</span>
              </div>
              <p className="text-lg font-medium text-gray-600">
                {request.data.minFloor && request.data.maxFloor
                  ? `${toPersianNumber(request.data.minFloor)} تا ${toPersianNumber(request.data.maxFloor)}`
                  : request.data.minFloor
                    ? `از ${toPersianNumber(request.data.minFloor)}`
                    : `تا ${toPersianNumber(request.data.maxFloor)}`}
              </p>
            </div>
          ) : null}
        </div>
      </div>

      <div className="rounded-2xl border-gray-200 bg-white p-0 shadow-sm sm:border sm:p-6">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
          <HomeIcon className="size-5 text-blue-600" />
          امکانات ملک
        </h2>
        <div className="flex w-full flex-wrap gap-2.5">
          {estateAmenities.map((item, i) => (
            <AmenityTag key={i} {...item} delay={i} />
          ))}
        </div>
      </div>

      {/* Additional Information */}
      <div className="rounded-2xl border-gray-200 bg-white p-0 shadow-sm sm:border sm:p-6">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
          <ClockIcon className="size-5 text-purple-600" />
          اطلاعات تکمیلی
        </h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 py-2">
              <span className="font-medium text-gray-600">تاریخ ایجاد:</span>
              <span className="text-gray-900">
                {formatDate(request.data.createdAt)}
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-gray-100 py-2">
              <span className="font-medium text-gray-600">نوع معامله:</span>
              <span className="text-gray-900">
                {getCategoryPersianName(request.data.category.dealType)}
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-gray-100 py-2">
              <span className="font-medium text-gray-600">منطقه:</span>
              <span className="text-gray-900">
                {request.data.category.name}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 py-2">
              <span className="font-medium text-gray-600">نام کاربر:</span>
              <span className="text-gray-900">
                {request.data.user.firstName} {request.data.user.lastName}
              </span>
            </div>
            {request.data.category.propertyType && (
              <div className="flex items-center justify-between border-b border-gray-100 py-2">
                <span className="font-medium text-gray-600">نوع ملک:</span>
                <span className="text-gray-900">
                  {getCategoryPersianName(request.data.category.propertyType)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
