"use client";

import { IFilterLight } from "@/components/Icons";
import EmptyState from "@/components/modules/EmptyState";
import {
  getFieldPersianName,
  getFieldsForCategories,
} from "@/components/modules/estate/ConditionalField";
import EstateCardItem from "@/components/modules/estate/EstateCardItem";
import { AllCreateFileFields } from "@/components/modules/estate/EstateUtils";
import Pagination from "@/components/modules/Pagination";
import { FeatureFlag, isFeatureEnabled } from "@/config/features";
import { type ESTATE_ARCHIVE_STATUS, type ESTATE_STATUS } from "@/enums";
import useSearchQueries from "@/hooks/useSearchQueries";
import {
  type DealType,
  type MainCategory,
  type PropertyType,
  getEnglishDealType,
  getEnglishMainCategory,
  getEnglishPropertyType,
} from "@/lib/categories";
import { cn } from "@/lib/utils";
import { Permissions } from "@/permissions/permission.types";
import { useCreatedEstateList } from "@/services/queries/admin/estate/useCreatedEstateList";
import { useEstateList } from "@/services/queries/admin/estate/useEstateList";
import { useUserInfo } from "@/services/queries/client/auth/useUserInfo";
import { usePanelMenuStore } from "@/stores/panelMenuStore";
import { type TCategory } from "@/types/admin/category/types";
import {
  FilePlus2,
  Grid2X2Icon,
  Settings2Icon,
  TableOfContentsIcon,
  UsersIcon,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import EstateActions from "./EstateActions";
import EstatesTable from "./EstatesTable";
import EstatesTableSkeleton from "./EstatesTableSkeleton";
import FilterModal, { type FilterState } from "./FilterModal";
import SelectCategories from "./SelectCategories";
import TableFieldsModal from "./TableFieldsModal";
import OwnersModal from "./OwnersModal";
import { useUserEstateList } from "@/services/queries/client/dashboard/estate/useUserEstateList";
import { useSavedEstateList } from "@/services/queries/client/dashboard/estate/useSavedEstateList";

const LIMIT_PER_PAGE = 12;

const allowFields = [
  "metrage", // متراژ
  "floor", // طبقه
  "parkingCount", // پارکینگ
  "buildYear", // سال ساخت
  "totalPrice", // کل قیمت
  "metragePrice", // قیمت متری
  "rahnPrice", // رهن
  "ejarePrice", // اجاره
  "location", // موقعیت ملک
  "roomCount", // تعداد خواب
  "address", // آدرس دقیق
  "approximateAddress", // آدرس تقریبی
  "arzMelk", // عرض ملک
  "arzGozar", // عرض گذر
  "dahaneMetrage", // متراژ دهنه
  "estateCode", // کد فایل
  "title",
  "owners",
];

// تعیین اندازه مناسب برای هر فیلد بر اساس اسم فیلد
const getFieldBasisClass = (field: string) => {
  const percent6Fields = ["estateCode"];
  const basis1of12Fields = ["address"];
  const percent12Fields = [""];

  const basis2of12Fields = [
    "buildYear",
    "roomCount",
    "parkingCount",
    "metrage",
    "metragePrice",
    "rahnPrice",
    "ejarePrice",
    "totalPrice",
    "floor",
    "arzGozar",
    "arzMelk",
  ];

  const percent22Fields = ["status"];

  const basis3of12Fields = [
    "title",
    "location",
    "dahaneMetrage",
    "approximateAddress",
  ];

  if (percent6Fields.includes(field)) {
    return "hidden shrink-0 basis-[6%] xl:block";
  }
  if (basis1of12Fields.includes(field)) {
    return "hidden shrink-0 basis-1/12 xl:block";
  }
  if (percent12Fields.includes(field)) {
    return "hidden shrink-0 basis-[12%] xl:block";
  }
  if (basis2of12Fields.includes(field)) {
    return "hidden shrink-0 basis-2/12 xl:block";
  }
  if (percent22Fields.includes(field)) {
    return "hidden shrink-0 basis-[22%] xl:block";
  }
  if (basis3of12Fields.includes(field)) {
    return "hidden shrink-0 basis-3/12 xl:block";
  }
  // پیش‌فرض برای فیلدهای ناشناخته
  return "hidden shrink-0 basis-[12%] xl:block";
};

export interface ITableField {
  field: string;
  fieldName: string;
  className: string;
  isVisible: boolean;
  order: number;
  isEditable: boolean;
  valueClassName?: string;
}

export default function EstatesContainer({
  filter,
  status,
  archiveStatus,
  isUserPanel,
}: {
  filter: string;
  status?: ESTATE_STATUS;
  archiveStatus?: ESTATE_ARCHIVE_STATUS | "ALL" | "NOTHING";
  isUserPanel?: boolean;
}) {
  const [isOpenOwnersModal, setIsOpenOwnersModal] = useState(false);
  const [owners, setOwners] = useState<
    {
      id: string;
      position?: string;
      phoneNumber: string;
      firstName: string;
      lastName: string;
    }[]
  >([]);
  const [viewType, setViewType] = useState<"grid" | "table">("grid");
  const [selectedCategories, setSelectedCategories] = useState<
    (Partial<TCategory> & { parents?: { id?: string }[] })[]
  >([]);
  const [selectedRegions, setSelectedRegions] = useState<
    { key: string; title: string; parent?: { id: string; title: string } }[]
  >([]);
  const [isTableFieldsModalOpen, setIsTableFieldsModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [tableFields, setTableFields] = useState<ITableField[]>([]);
  const searchParams = useSearchParams();
  const { isMinimized } = usePanelMenuStore();
  const searchQueries = useSearchQueries();
  const { userInfo } = useUserInfo();

  const accessToOwners =
    userInfo?.data?.data.accessPerms.includes(Permissions.GET_ESTATE_OWNERS) ||
    userInfo?.data?.data.accessPerms.includes(Permissions.OWNER) ||
    userInfo?.data?.data.accessPerms.includes(Permissions.SUPER_USER);

  const accessToAddress =
    userInfo?.data?.data.accessPerms.includes(Permissions.GET_ESTATE_ADDRESS) ||
    userInfo?.data?.data.accessPerms.includes(Permissions.OWNER) ||
    userInfo?.data?.data.accessPerms.includes(Permissions.SUPER_USER);

  // Read filters from URL
  const currentFilters: FilterState = {
    search: searchParams.get("search") || "",
    priceMin: searchParams.get("priceMin") || "",
    priceMax: searchParams.get("priceMax") || "",
    metrageMin: searchParams.get("metrageMin")
      ? parseInt(searchParams.get("metrageMin")!)
      : null,
    metrageMax: searchParams.get("metrageMax")
      ? parseInt(searchParams.get("metrageMax")!)
      : null,
    estateCode: searchParams.get("estateCode") || "",
    // New filters
    roomCount: searchParams.get("roomCount") || "",
    floor: searchParams.get("floor") || "",
    buildYear: searchParams.get("buildYear") || "",
    isExchangeable: searchParams.get("isExchangeable") === "true",
    floorCount: searchParams.get("floorCount") || "",
    location: searchParams.get("location") || "",
    parkingCount: searchParams.get("parkingCount") || "",
    completionStatus:
      (searchParams.get("completionStatus") as
        | "all"
        | "incomplete"
        | "hasFile") || "",
    completionPercentage: searchParams.get("completionPercentage")
      ? parseInt(searchParams.get("completionPercentage")!)
      : 50,
    regionName: searchParams.get("regionName") || "",
    hasFile: searchParams.get("hasFile") === "false",
  };

  // Check if any filters are active
  const hasActiveFilters = Object.entries(currentFilters).some(
    ([key, value]) => {
      // Skip completionPercentage if completionStatus is not "incomplete"
      if (
        key === "completionPercentage" &&
        currentFilters.completionStatus !== "incomplete"
      ) {
        return false;
      }

      // Skip hasFile if completionStatus is not "hasFile"
      if (key === "hasFile" && currentFilters.completionStatus !== "hasFile") {
        return false;
      }

      if (Array.isArray(value)) {
        return value.length > 0;
      }
      return value !== "" && value !== null && value !== false;
    },
  );

  // برای جلوگیری از race condition
  const previousCategories = useRef<string>("");

  const params = {
    ...currentFilters,
    metrageMin: currentFilters.metrageMin?.toString() || "",
    metrageMax: currentFilters.metrageMax?.toString() || "",
    page: searchParams.get("page") || "1",
    limit: LIMIT_PER_PAGE.toString(),
    DealType: selectedCategories?.[0]?.dealType
      ? getEnglishDealType(selectedCategories[0].dealType) ||
        (selectedCategories[0].dealType as DealType)
      : undefined,
    MainCategory: selectedCategories?.[1]?.name
      ? getEnglishMainCategory(selectedCategories[1].name) ||
        (selectedCategories[1].name as MainCategory)
      : undefined,
    PropertyType: selectedCategories?.[2]?.name
      ? getEnglishPropertyType(selectedCategories[2].name) ||
        (selectedCategories[2].name as PropertyType)
      : undefined,
    ...(currentFilters.regionName && {
      regionName: currentFilters.regionName,
    }),
    // New filter parameters
    roomCount: currentFilters.roomCount || undefined,
    floor: currentFilters.floor || undefined,
    buildYear: currentFilters.buildYear || undefined,
    isExchangeable: currentFilters.isExchangeable || undefined,
    floorCount: currentFilters.floorCount || undefined,
    location: currentFilters.location || undefined,
    parkingCount: currentFilters.parkingCount || undefined,
    percentage:
      currentFilters.completionStatus === "incomplete"
        ? currentFilters.completionPercentage
          ? currentFilters.completionPercentage
          : 50
        : undefined,
    hasFile:
      currentFilters.completionStatus === "hasFile"
        ? currentFilters.hasFile
        : undefined,
    categoryIds: selectedRegions.map((region) => region.key || "").join(","),
    status,
    archiveStatus,
  };

  const { createdEstateList } = useCreatedEstateList({
    enabled: filter === "my-estates" && !isUserPanel ? true : false,
    params,
  });
  const { estateList } = useEstateList({
    enabled: filter === "all-estates" && !isUserPanel ? true : false,
    params,
  });
  const { userEstateList } = useUserEstateList({
    enabled: filter === "my-estates" && isUserPanel ? true : false,
    params,
  });
  const { savedEstateList } = useSavedEstateList({
    enabled: filter === "saved-estates" && isUserPanel ? true : false,
    params,
  });

  const estateListData =
    filter === "saved-estates" && isUserPanel
      ? savedEstateList?.data
      : filter === "my-estates" && isUserPanel
        ? userEstateList?.data
        : filter === "all-estates"
          ? estateList?.data
          : createdEstateList?.data;

  const estateListLoading =
    filter === "saved-estates" && isUserPanel
      ? savedEstateList?.isLoading
      : filter === "my-estates" && isUserPanel
        ? userEstateList?.isLoading
        : filter === "all-estates" && !isUserPanel
          ? estateList?.isLoading
          : createdEstateList?.isLoading;

  // تولید کلید منحصر به فرد برای دسته‌بندی‌های انتخابی
  const getStorageKey = () => {
    if (selectedCategories.length < 3) return null;
    const categories = selectedCategories
      .map((cat) => cat.name)
      .sort()
      .join("|");
    return `estateTableFields_${categories}`;
  };

  // تولید فیلدهای جدول بر اساس دسته‌بندی‌های انتخابی
  useEffect(() => {
    if (selectedCategories.length >= 3 && userInfo?.data?.data.phoneNumber) {
      const currentCategoriesKey = selectedCategories
        .map((cat) => cat.name)
        .sort()
        .join("|");

      // اگر دسته‌بندی‌ها تغییر کرده‌اند
      if (currentCategoriesKey !== previousCategories.current) {
        previousCategories.current = currentCategoriesKey;

        const availableFields = getFieldsForCategories(
          selectedCategories as TCategory[],
        );

        // بارگذاری از localStorage
        const storageKey = getStorageKey();
        let savedFields: ITableField[] = [];

        if (storageKey) {
          const saved = localStorage.getItem(storageKey);
          if (saved) {
            savedFields = JSON.parse(saved);
          }
        }

        // بررسی اینکه آیا فیلدهای ذخیره شده با دسته‌بندی‌های جدید سازگار هستند
        const savedFieldNames = savedFields.map((field) => field.field);
        const newFieldNames = availableFields.map((field) => field);

        // اگر فیلدها تغییر کرده‌اند یا فیلدهای ذخیره شده وجود ندارند
        const fieldsChanged =
          savedFields.length === 0 ||
          savedFieldNames.length !== newFieldNames.length ||
          !savedFieldNames.every((field) =>
            newFieldNames.includes(field as any),
          ) ||
          !newFieldNames.every((field) => savedFieldNames.includes(field));

        if (fieldsChanged) {
          // حفظ تنظیمات قبلی کاربر برای فیلدهای مشترک
          const preservedSettings = new Map();
          savedFields.forEach((field) => {
            preservedSettings.set(field.field, {
              isVisible: field.isVisible,
              order: field.order,
            });
          });

          const newFields: ITableField[] = [
            {
              field: "estateCode",
              fieldName: "کد فایل",
              className: getFieldBasisClass("estateCode"),
              isVisible: preservedSettings.get("estateCode")?.isVisible ?? true,
              order: preservedSettings.get("estateCode")?.order ?? 0,
              isEditable: true,
              valueClassName: "pr-3",
            },
            {
              field: "title",
              fieldName: "عنوان",
              className: getFieldBasisClass("title"),
              isVisible: preservedSettings.get("title")?.isVisible ?? true,
              order: preservedSettings.get("title")?.order ?? 0,
              isEditable: true,
            },
            {
              field: "status",
              fieldName: "وضعیت نمایش",
              className: getFieldBasisClass("status"),
              isVisible: preservedSettings.get("status")?.isVisible ?? true,
              order: preservedSettings.get("status")?.order ?? 0,
              isEditable: true,
            },
            {
              field: "archiveStatus",
              fieldName: "وضعیت آرشیو",
              className: getFieldBasisClass("status"),
              isVisible: preservedSettings.get("status")?.isVisible ?? true,
              order: preservedSettings.get("status")?.order ?? 0,
              isEditable: true,
            },
            ...(accessToOwners && !isUserPanel
              ? [
                  {
                    field: "owners",
                    fieldName: "مالک ها",
                    className: getFieldBasisClass("owners"),
                    isVisible: accessToOwners
                      ? (preservedSettings.get("owners")?.isVisible ?? true)
                      : false,
                    order: preservedSettings.get("owners")?.order ?? 0,
                    isEditable: true,
                  },
                ]
              : []),
            ...availableFields
              .filter((field) => allowFields.includes(field))
              .filter((field) => {
                if (
                  selectedCategories[0].dealType === "FOR_RENT" &&
                  (field === AllCreateFileFields.TOTAL_PRICE ||
                    field === AllCreateFileFields.METRAGE_PRICE)
                )
                  return false;

                if (
                  selectedCategories[0].dealType === "FOR_SALE" &&
                  (field === AllCreateFileFields.RAHN_PRICE ||
                    field === AllCreateFileFields.EJARE_PRICE)
                )
                  return false;

                return true;
              })
              .filter((field) => {
                if (field === AllCreateFileFields.ADDRESS && !accessToOwners) {
                  return false;
                }
                return true;
              })
              .map((field, index) => {
                const preserved = preservedSettings.get(field);

                if (field === AllCreateFileFields.ADDRESS && accessToAddress) {
                  return {
                    field: field,
                    fieldName: getFieldPersianName(field),
                    className: getFieldBasisClass(field),
                    isVisible: accessToAddress
                      ? (preserved?.isVisible ?? true)
                      : false,
                    order: preserved?.order ?? index + 1,
                    isEditable: true,
                  };
                }

                return {
                  field: field,
                  fieldName: getFieldPersianName(field),
                  className: getFieldBasisClass(field),
                  isVisible: preserved?.isVisible ?? true,
                  order: preserved?.order ?? index + 1,
                  isEditable: true,
                };
              }),
          ];

          // مرتب‌سازی بر اساس ترتیب
          newFields.sort((a, b) => a.order - b.order);

          setTableFields(newFields);

          // ذخیره در localStorage با کلید منحصر به فرد
          if (storageKey) {
            localStorage.setItem(storageKey, JSON.stringify(newFields));
          }
        } else {
          // استفاده از فیلدهای ذخیره شده
          setTableFields(savedFields);
        }
      }
    } else {
      // اگر دسته‌بندی‌ها کمتر از 3 تا هستند، فیلدها رو پاک کن
      setTableFields([]);
      previousCategories.current = "";
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategories, userInfo?.data?.data.phoneNumber]);

  // ذخیره تغییرات در localStorage
  useEffect(() => {
    if (tableFields.length > 0) {
      const storageKey = getStorageKey();
      if (storageKey) {
        localStorage.setItem(storageKey, JSON.stringify(tableFields));
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableFields]);

  // فیلدهای قابل نمایش برای جدول
  const visibleTableFields = tableFields
    .filter((field) => field.isVisible)
    .sort((a, b) => a.order - b.order);

  useEffect(() => {
    const viewType = localStorage.getItem("viewType");
    if (viewType && selectedCategories.length >= 3) {
      setViewType(viewType as "grid" | "table");
    } else {
      setViewType("grid");
    }
  }, [selectedCategories]);

  if (!isFeatureEnabled(FeatureFlag.ESTATES)) {
    return null;
  }

  return (
    <>
      <div className="pt-7 sm:pt-16">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-start gap-2">
            <SelectCategories
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
              selectedRegions={selectedRegions}
              setSelectedRegions={setSelectedRegions}
            />
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:shrink-0 sm:justify-center">
            {(selectedCategories.length > 0 ||
              selectedRegions.length > 0 ||
              hasActiveFilters) && (
              <button
                className="group flex h-12 shrink-0 items-center justify-center rounded-full border border-red-500/70 bg-red-500/10 px-4 text-primary-red shadow-sm transition-all hover:bg-primary-red/20"
                onClick={() => {
                  setSelectedCategories([]);
                  setSelectedRegions([]);
                  localStorage.removeItem("mainCategory");
                  localStorage.removeItem("subCategory");
                  localStorage.removeItem("propertyType");
                  localStorage.removeItem("regions");
                  searchQueries(
                    [
                      "search",
                      "priceMin",
                      "priceMax",
                      "metrageMin",
                      "metrageMax",
                      "estateCode",
                      "roomCount",
                      "floor",
                      "buildYear",
                      "isExchangeable",
                      "floorCount",
                      "location",
                      "parkingCount",
                      "regionName",
                      "completionStatus",
                      "completionPercentage",
                      "hasFile",
                      "categoryIds",
                    ],
                    [],
                  );

                  toast.success("همه فیلتر ها پاک شدند");
                }}
                title="پاک کردن همه فیلتر ها">
                حذف فیلترها
              </button>
            )}
            <button
              className="group relative flex size-12 items-center justify-center rounded-full border border-primary-border/50 bg-white shadow-sm transition-all hover:border-primary-blue/70 hover:bg-primary-blue/10"
              onClick={() => setIsFilterModalOpen(true)}
              title="فیلترهای جستجو">
              <IFilterLight className="size-5 text-text-300 transition-colors group-hover:text-primary-blue" />
              {hasActiveFilters && (
                <>
                  <div className="absolute -right-0.5 -top-0.5 size-3 animate-ping rounded-full bg-red-500" />
                  <div className="absolute -right-0.5 -top-0.5 size-3 rounded-full bg-red-500" />
                </>
              )}
            </button>

            {filter === "saved-estates" ? null : (
              <>
                {viewType === "table" && selectedCategories.length >= 3 && (
                  <button
                    className="group flex size-12 items-center justify-center rounded-full border border-primary-border/50 bg-white shadow-sm transition-all hover:border-primary-blue/70 hover:bg-primary-blue/10"
                    onClick={() => setIsTableFieldsModalOpen(true)}
                    title="تنظیمات ستون‌های جدول">
                    <Settings2Icon
                      size={20}
                      className="text-text-300 transition-colors group-hover:text-primary-blue"
                    />
                  </button>
                )}
                <div className="relative z-[1] flex items-center gap-x-1 rounded-full border border-primary-border/50 bg-white p-1 shadow-sm">
                  <div className="absolute inset-0 -z-[1] flex size-full items-center p-1 transition-all">
                    <div
                      className={cn(
                        "-z-[1] size-10 rounded-full bg-primary-blue transition-all",
                      )}
                      style={{
                        transform:
                          viewType === "grid"
                            ? "translateX(0)"
                            : "translateX(calc(-100% - 4px))",
                        // marginLeft: viewType === "table" ? "auto" : "0",
                      }}
                    />
                  </div>
                  <button
                    className={cn(
                      "flex size-10 items-center justify-center rounded-full transition-all",
                      viewType === "grid"
                        ? "text-white"
                        : "text-text-300 hover:bg-gray-100",
                    )}
                    onClick={() => {
                      setViewType("grid");
                      localStorage.setItem("viewType", "grid");
                    }}>
                    <Grid2X2Icon size={24} />
                  </button>
                  <button
                    className={cn(
                      "flex size-10 items-center justify-center rounded-full transition-all",
                      viewType === "table"
                        ? "text-white"
                        : "text-text-300 hover:bg-gray-100",
                    )}
                    onClick={() => {
                      if (selectedCategories.length < 3) {
                        toast.error("دسته بندی ها باید انتخاب شده باشند!");
                        return;
                      }
                      setViewType("table");
                      localStorage.setItem("viewType", "table");
                    }}>
                    <TableOfContentsIcon size={24} />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="pt-4">
          <p
            className={cn(
              "text-sm text-text-300",
              (estateListData?.meta?.total === 0 || estateListLoading) &&
                "hidden",
            )}>
            {estateListData?.meta?.total || 0} فایل یافت شد
          </p>
          {viewType === "grid" || selectedCategories.length < 3 ? (
            <>
              {estateListLoading ? (
                <div
                  className={cn(
                    "grid grid-cols-1 gap-5 pt-5 sm:grid-cols-2 xl:grid-cols-3",
                    isMinimized && "md:grid-cols-3 xl:grid-cols-4",
                  )}>
                  {Array.from({ length: LIMIT_PER_PAGE }).map((_, i) => (
                    <div
                      key={i}
                      className="h-64 animate-pulse rounded-xl bg-neutral-100 shadow"
                    />
                  ))}
                </div>
              ) : estateListData?.data?.length &&
                estateListData?.data?.length > 0 ? (
                <div
                  className={cn(
                    "grid grid-cols-1 gap-5 pt-5 sm:grid-cols-2 xl:grid-cols-3",
                    isMinimized && "md:grid-cols-3 xl:grid-cols-4",
                  )}>
                  {estateListData?.data?.map((estate) => (
                    <EstateCardItem
                      key={estate.id}
                      estate={estate}
                      showCompletionPercentage={
                        currentFilters.completionStatus === "incomplete"
                      }>
                      <div className="absolute left-2 top-2 z-[2] flex items-center gap-x-2">
                        {estate.owners && estate.owners.length > 0 && (
                          <button
                            className={cn(
                              "flex size-8 shrink-0 items-center justify-center rounded-full bg-white/60 p-1 text-primary-blue shadow-md backdrop-blur-sm transition-all hover:bg-white/80",
                            )}
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();

                              setIsOpenOwnersModal(true);
                              setOwners(estate.owners || []);
                            }}
                            title="اطلاعات مالک">
                            <UsersIcon className="size-5 shrink-0" />
                          </button>
                        )}
                        {filter !== "saved-estates" && (
                          <EstateActions
                            isTableView={false}
                            estate={estate}
                            archiveStatus={estate.archiveStatus}
                            status={estate.status}
                            title={estate.title}
                            className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white/60 text-primary-blue shadow-md backdrop-blur-sm transition-all hover:bg-white/80"
                            menuClassName="!mt-0 absolute top-0 left-full h-fit right-auto"
                            isUserPanel={isUserPanel}
                          />
                        )}
                      </div>
                    </EstateCardItem>
                  ))}
                </div>
              ) : (
                <div className="pt-1">
                  <EmptyState
                    className="bg-neutral-100"
                    title="فایلی یافت نشد"
                    description="هیچ نتیجه‌ای مطابق فیلترهای انتخابی پیدا نشد."
                    icon={<FilePlus2 className="size-7" />}
                  />
                </div>
              )}
            </>
          ) : (
            <>
              {estateListLoading ? (
                <EstatesTableSkeleton visibleTableFields={visibleTableFields} />
              ) : (
                <EstatesTable
                  visibleTableFields={visibleTableFields}
                  data={estateListData}
                />
              )}
            </>
          )}
          <Pagination
            pageInfo={{
              totalPages: estateListData?.meta?.totalPages || 1,
              currentPage: estateListData?.meta?.page || 1,
            }}
          />
        </div>
      </div>

      {/* مودال تنظیمات فیلدهای جدول */}
      <TableFieldsModal
        isOpen={isTableFieldsModalOpen}
        onClose={() => setIsTableFieldsModalOpen(false)}
        tableFields={tableFields}
        setTableFields={setTableFields}
      />

      {/* مودال فیلترهای جستجو */}
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        currentFilters={currentFilters}
      />

      {isOpenOwnersModal && (
        <OwnersModal
          isOpenModal={isOpenOwnersModal}
          setIsOpenModal={setIsOpenOwnersModal}
          owners={owners}
        />
      )}
    </>
  );
}
