import PanelBodyHeader from "@/app/(panel)/_components/PanelBodyHeader";
import BorderedButton from "@/components/modules/buttons/BorderedButton";
import Button from "@/components/modules/buttons/Button";
import {
  getCategoryPersianName,
  shouldShowFieldForCategories,
} from "@/components/modules/estate/ConditionalField";
import {
  AllCreateFileFields,
  calculateEstateCompletionPercentage,
  createEstateNameByCategories,
  findBy,
  getFeaturesForCategories,
  melkLocation,
  shopLocation,
} from "@/components/modules/estate/EstateUtils";
import { ESTATE_STATUS } from "@/enums";
import {
  DealTypeEnum,
  type DealType,
  type MainCategory,
  type PropertyType,
} from "@/lib/categories";
import { formatNumber, unFormatNumber } from "@/lib/utils";
import { Permissions } from "@/permissions/permission.types";
import useMutateEstateNote from "@/services/mutations/admin/estate/note/useMutateEstateNote";
import useCreateRequest from "@/services/mutations/admin/estate/useCreateRequest";
import useMutateEstate from "@/services/mutations/admin/estate/useMutateEstate";
import useUserMutateEstate from "@/services/mutations/client/dashboard/estate/useUserMutateEstate";
import { useEstate } from "@/services/queries/admin/estate/useEstate";
import { useUserInfo } from "@/services/queries/client/auth/useUserInfo";
import { useUserEstate } from "@/services/queries/client/dashboard/estate/useUserEstate";
import { type TCategory } from "@/types/admin/category/types";
import { REQUEST_TYPE } from "@/types/admin/estate/enum";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import EstateCreateConfirmationModal from "./EstateCreateConfirmationModal";
import EstateGallery from "./EstateGallery";
import EstateInformation from "./EstateInformation";
import MutateEstateSkeleton from "./MutateEstateSkeleton";

export const mutateEstateSchema = z.object({
  title: z.string().min(3, { message: "عنوان باید حداقل 3 کاراکتر باشد" }),
  description: z.string().optional(),
  // قابل معاوضه : یادداشت
  note: z.string().optional(),
  // یادداشت املاک که بعد از ایجاد املاک به صورت جداگانه ذخیره می‌شود
  estateNote: z.string().optional(),
  owners: z
    .array(
      z.object({
        ownerId: z.string().optional(),
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        phoneNumber: z.string().optional(),
        position: z.string().optional(),
        fixPhoneNumber: z.string().optional(),
      }),
    )
    .optional(),
  files: z
    .array(
      z.object({
        url: z.string().default(""),
        file_name: z.string().default(""),
        key: z.string().default(""),
        mimeType: z.string().default(""),
        isPoster: z.boolean().default(false),
        file: z.any().default(""),
      }),
    )
    .default([]),
  // متراژ - متراژ عرصه یا متراژ کل
  metrage: z
    .string({
      message: "متراژ باید حداقل 1 باشد",
      invalid_type_error: "متراژ باید حداقل 1 باشد",
    })
    .min(1, {
      message: "متراژ باید حداقل 1 باشد",
    }),
  // قیمت هر متر
  metragePrice: z
    .string({
      message: "قیمت هر متر باید حداقل 1 باشد",
      invalid_type_error: "قیمت هر متر باید حداقل 1 باشد",
    })
    .optional(),
  // قیمت رهن
  rahnPrice: z
    .string({
      message: "قیمت رهن باید حداقل 1 باشد",
      invalid_type_error: "قیمت رهن باید حداقل 1 باشد",
    })
    .optional(),
  // قیمت اجاره
  ejarePrice: z
    .string({
      message: "قیمت اجاره باید حداقل 1 باشد",
    })
    .optional()
    .nullable(),
  // قیمت کل
  totalPrice: z
    .string({
      message: "قیمت کل باید حداقل 1 باشد",
      invalid_type_error: "قیمت کل باید حداقل 1 باشد",
    })
    .optional(),
  // سال ساخت : از ۱۳۴۰ تا ۱۴۳۰
  buildYear: z.string().optional(),
  // تعداد طبقات : ۱ تا ۳۰
  floorCount: z.string().optional(),
  // طبقه
  floor: z.string().optional(),
  // تعداد واحد در طبقه : ۰ تا ۲۰
  floorUnitCount: z.string().optional(),
  // فایل یابی از طریق
  findBy: z.enum(findBy as [string, ...string[]]).optional(),
  // آدرس
  address: z.string().optional(),
  // آدرس حدودی
  approximateAddress: z.string().optional(),
  // تعداد اتاق از یک تا ده اختیاری
  roomCount: z.string().optional(),
  // موقعیت ملک
  location: z
    .array(
      z.enum([...melkLocation, ...shopLocation] as [string, ...string[]]),
      {
        message: "موقعیت ملک را مشخص کنید!",
      },
    )
    .default([]),
  // متراژ کف
  floorMetrage: z.string().optional(),
  // متراژ دهنه
  dahaneMetrage: z.string().optional(),
  // ارتفاع سقف
  height: z.string().optional(),
  // انبار تجاری
  inventory: z.string().optional(),
  // عرض ملک
  arzMelk: z.string().optional(),
  // عرض گذر
  arzGozar: z.string().optional(),
  // طول ملک
  tolMelk: z.string().optional(),
  // متراژ بنا
  banaMetrage: z.string().optional(),
  // قیمت بنا
  banaPrice: z.string().optional(),
  // متراژ سوله
  soleMetrage: z.string().optional(),
  // متراژ بالکونی
  balkonMetrage: z.string().optional(),
  // دسته بندی
  categoryId: z.string().optional(),
  // تعداد پارکینگ
  parkingCount: z.string().optional(),

  // امکانات ملک - حالا بر اساس label ذخیره می‌شوند و شامل title هم هستند
  properties: z
    .object({
      // مشخصه ملک
      architectureStyle: z.array(z.string()).optional(),
      architectureStatus: z.array(z.string()).optional(),
      architectureSpaces: z.array(z.string()).optional(),
      property: z.array(z.string()).optional(), // برای مغازه
      // نما ساختمان
      facadeMaterials: z.array(z.string()).optional(),
      facadeStyle: z.array(z.string()).optional(),
      // مشاعات
      commonsFeatures: z.array(z.string()).optional(),
      commonsSpaces: z.array(z.string()).optional(),
      commonsServices: z.array(z.string()).optional(),
      // سرمایش و گرمایش
      coolingHeating: z.array(z.string()).optional(),
      // پوشش‌ها
      floorCovering: z.array(z.string()).optional(),
      wallAndCeiling: z.array(z.string()).optional(),
      // آشپزخانه
      kitchenCabinet: z.array(z.string()).optional(),
      kitchenCabinetPanel: z.array(z.string()).optional(),
      kitchenEquipment: z.array(z.string()).optional(),
      kitchenSpaces: z.array(z.string()).optional(),
      // نوع سرویس بهداشتی
      wcType: z.array(z.string()).optional(),
      // سایر امکانات و امتیازات
      otherFacilitiesSpaces: z.array(z.string()).optional(),
      facilities: z.array(z.string()).optional(),
      points: z.array(z.string()).optional(),
      parking: z.array(z.string()).optional(),
      // وضعیت ملک
      documents: z.array(z.string()).optional(),
      documentType: z.array(z.string()).optional(),
      residenceStatus: z.array(z.string()).optional(),
      // تاریخ خروج مستاجر
      tenantExiteDate: z.any().optional(),
      // نوع قرارداد (وقتی قراردادی انتخاب شده)
      contractType: z.array(z.string()).optional(),
      // تاریخ صدور سند (برای در دست اقدام، پایانکار، عدم خلافی)
      documentIssueDate: z.any().optional(),
      // مقدار وام (وقتی وام دار انتخاب شده)
      loanAmount: z.string().optional(),
      // نوع آسانسور (وقتی آسانسور انتخاب شده)
      elevatorType: z.array(z.string()).optional(),
      // تعداد آسانسور نفر بر
      passengerElevatorCount: z.string().optional(),
      // تعداد آسانسور باری
      freightElevatorCount: z.string().optional(),
    })
    .optional(),
  adviserId: z.string().optional(),
  // متراژ اعیان
  ayanMetrage: z.string().optional(),
});

export default function MutateEstate({
  selectedCategories,
  setSelectedCategories,
  setSelectedRegion,
  selectedRegion,
  isEditing,
  setFirstRender,
  firstRender,
  isUserPanel,
}: {
  selectedCategories?: TCategory[];
  setSelectedCategories?: (categories: TCategory[] | null) => void;
  setSelectedRegion?: (region: TCategory | null) => void;
  selectedRegion?: TCategory | null;
  isEditing?: boolean;
  setFirstRender?: (firstRender: boolean) => void;
  firstRender?: boolean;
  isUserPanel?: boolean;
}) {
  const router = useRouter();
  const { mutateEstate: adminMutateEstate } = useMutateEstate();
  const { userMutateEstate } = useUserMutateEstate();
  const mutateEstate = isUserPanel ? userMutateEstate : adminMutateEstate;
  const { mutateEstateNote } = useMutateEstateNote();
  const { createRequest } = useCreateRequest();
  const { userInfo } = useUserInfo();
  const { id } = useParams<{ id: string }>();
  const { estate: adminEstate } = useEstate({
    id: id as string,
    enable: isEditing && !isUserPanel,
    staleTime: 0,
    gcTime: 0,
  });
  const { userEstate } = useUserEstate({
    id: id as string,
    enable: isEditing && !!isUserPanel,
    staleTime: 0,
    gcTime: 0,
  });
  const estate = isUserPanel ? userEstate : adminEstate;
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();

  const isEstateAdvisor =
    isEditing && estate?.data?.data?.adviser?.id === userInfo?.data?.data.id;

  // Permission checks
  const canDirectEdit =
    userInfo?.data?.data.accessPerms.includes(Permissions.OWNER) ||
    userInfo?.data?.data.accessPerms.includes(Permissions.SUPER_USER) ||
    userInfo?.data?.data.accessPerms.includes(Permissions.MANAGE_ESTATE) ||
    isEstateAdvisor;

  const canViewOwners =
    userInfo?.data?.data.accessPerms.includes(Permissions.GET_ESTATE_OWNERS) ||
    userInfo?.data?.data.accessPerms.includes(Permissions.OWNER) ||
    userInfo?.data?.data.accessPerms.includes(Permissions.SUPER_USER) ||
    userInfo?.data?.data.accessPerms.includes(Permissions.MANAGE_ESTATE) ||
    isEstateAdvisor;

  console.log("canViewOwners", canViewOwners);

  const canViewAddress =
    userInfo?.data?.data.accessPerms.includes(Permissions.GET_ESTATE_ADDRESS) ||
    userInfo?.data?.data.accessPerms.includes(Permissions.OWNER) ||
    userInfo?.data?.data.accessPerms.includes(Permissions.MANAGE_ESTATE) ||
    userInfo?.data?.data.accessPerms.includes(Permissions.SUPER_USER) ||
    isEstateAdvisor;

  // Helper function to extract values from property (new structure only)
  const getPropertyValues = (property: any): string[] => {
    if (!property) return [];

    // ساختار جدید که شامل values هست
    if (
      typeof property === "object" &&
      "values" in property &&
      Array.isArray(property.values)
    ) {
      return property.values;
    }

    return [];
  };

  // Helper function to extract date values from conditional fields (new structure only)
  const getConditionalDateValue = (property: any): string | undefined => {
    if (!property) return undefined;

    // ساختار جدید که شامل values هست
    if (
      typeof property === "object" &&
      "values" in property &&
      Array.isArray(property.values) &&
      property.values.length > 0
    ) {
      return property.values[0];
    }

    return undefined;
  };

  // Helper function to extract loan amount from conditional fields (new structure only)
  const getConditionalLoanValue = (property: any): string => {
    if (!property) return "";

    // ساختار جدید که شامل values هست
    if (
      typeof property === "object" &&
      "values" in property &&
      Array.isArray(property.values) &&
      property.values.length > 0
    ) {
      // Remove "تومان" suffix if present
      return property.values[0].replace(" تومان", "");
    }

    return "";
  };

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [pendingFormData, setPendingFormData] = useState<z.infer<
    typeof mutateEstateSchema
  > | null>(null);
  const {
    register,
    formState: { errors },
    setValue,
    watch,
    control,
    handleSubmit,
    setError,
    clearErrors,
  } = useForm<z.infer<typeof mutateEstateSchema>>({
    resolver: zodResolver(mutateEstateSchema),
    defaultValues: {
      categoryId: isEditing ? "" : selectedRegion?.id || "",
      title: isEditing
        ? ""
        : createEstateNameByCategories([
            ...(selectedCategories || []),
            selectedRegion || { name: "" },
          ]),
      estateNote: "",
    },
    values: isEditing
      ? {
          title: estate?.data?.data?.title || "",
          description: estate?.data?.data?.description || "",
          note: estate?.data?.data?.note || "",
          owners:
            estate?.data?.data?.owners?.map((owner) => ({
              ownerId: owner.id,
              firstName: owner.firstName,
              lastName: owner.lastName,
              phoneNumber: owner.phoneNumber,
              fixPhoneNumber: owner.fixPhoneNumber,
            })) || [],
          files: estate?.data?.data?.files || [],
          metrage: estate?.data?.data?.metrage.toString() || "",
          address: estate?.data?.data?.address || "",
          approximateAddress: estate?.data?.data?.approximateAddress || "",
          location: estate?.data?.data?.location || [],
          floorMetrage: estate?.data?.data?.floorMetrage
            ? estate?.data?.data?.floorMetrage.toString()
            : undefined,
          dahaneMetrage: estate?.data?.data?.dahaneMetrage
            ? estate?.data?.data?.dahaneMetrage.toString()
            : undefined,
          height: estate?.data?.data?.height
            ? estate?.data?.data?.height.toString()
            : undefined,
          inventory: estate?.data?.data?.inventory
            ? estate?.data?.data?.inventory.toString()
            : undefined,
          arzMelk: estate?.data?.data?.arzMelk
            ? estate?.data?.data?.arzMelk.toString()
            : undefined,
          arzGozar: estate?.data?.data?.arzGozar
            ? estate?.data?.data?.arzGozar.toString()
            : undefined,
          tolMelk: estate?.data?.data?.tolMelk
            ? estate?.data?.data?.tolMelk.toString()
            : undefined,
          banaMetrage: estate?.data?.data?.banaMetrage
            ? estate?.data?.data?.banaMetrage.toString()
            : undefined,
          soleMetrage: estate?.data?.data?.soleMetrage
            ? estate?.data?.data?.soleMetrage.toString()
            : undefined,
          balkonMetrage: estate?.data?.data?.balkonMetrage
            ? estate?.data?.data?.balkonMetrage.toString()
            : undefined,
          categoryId: estate?.data?.data?.categoryId || undefined,
          parkingCount: estate?.data?.data?.parkingCount
            ? estate?.data?.data?.parkingCount.toString()
            : undefined,

          properties: estate?.data?.data?.properties
            ? {
                // مشخصه ملک
                architectureStyle: getPropertyValues(
                  estate.data.data.properties.architectureStyle,
                ),
                architectureStatus: getPropertyValues(
                  estate.data.data.properties.architectureStatus,
                ),
                architectureSpaces: getPropertyValues(
                  estate.data.data.properties.architectureSpaces,
                ),
                property: getPropertyValues(
                  estate.data.data.properties.property,
                ), // برای مغازه
                // نما ساختمان
                facadeMaterials: getPropertyValues(
                  estate.data.data.properties.facadeMaterials,
                ),
                facadeStyle: getPropertyValues(
                  estate.data.data.properties.facadeStyle,
                ),
                // مشاعات
                commonsFeatures: getPropertyValues(
                  estate.data.data.properties.commonsFeatures,
                ),
                commonsSpaces: getPropertyValues(
                  estate.data.data.properties.commonsSpaces,
                ),
                commonsServices: getPropertyValues(
                  estate.data.data.properties.commonsServices,
                ),
                // سرمایش و گرمایش
                coolingHeating: getPropertyValues(
                  estate.data.data.properties.coolingHeating,
                ),
                // پوشش‌ها
                floorCovering: getPropertyValues(
                  estate.data.data.properties.floorCovering,
                ),
                wallAndCeiling: getPropertyValues(
                  estate.data.data.properties.wallAndCeiling,
                ),
                // آشپزخانه
                kitchenCabinet: getPropertyValues(
                  estate.data.data.properties.kitchenCabinet,
                ),
                kitchenCabinetPanel: getPropertyValues(
                  estate.data.data.properties.kitchenCabinetPanel,
                ),
                kitchenEquipment: getPropertyValues(
                  estate.data.data.properties.kitchenEquipment,
                ),
                kitchenSpaces: getPropertyValues(
                  estate.data.data.properties.kitchenSpaces,
                ),
                // نوع سرویس بهداشتی
                wcType: getPropertyValues(estate.data.data.properties.wcType),
                // سایر امکانات و امتیازات
                otherFacilitiesSpaces: getPropertyValues(
                  estate.data.data.properties.otherFacilitiesSpaces,
                ),
                facilities: getPropertyValues(
                  estate.data.data.properties.facilities,
                ),
                points: getPropertyValues(estate.data.data.properties.points),
                parking: getPropertyValues(estate.data.data.properties.parking),
                // وضعیت ملک
                documents: getPropertyValues(
                  estate.data.data.properties.documents,
                ),
                documentType: getPropertyValues(
                  estate.data.data.properties.documentType,
                ),
                residenceStatus: getPropertyValues(
                  estate.data.data.properties.residenceStatus,
                ),
                // تاریخ خروج مستاجر
                tenantExiteDate: getConditionalDateValue(
                  estate?.data?.data?.properties?.tenantExiteDate,
                ),
                // نوع قرارداد
                contractType: getPropertyValues(
                  estate.data.data.properties.contractType,
                ),
                // تاریخ صدور سند
                documentIssueDate: getConditionalDateValue(
                  estate?.data?.data?.properties?.documentIssueDate,
                ),
                // مقدار وام
                loanAmount: getConditionalLoanValue(
                  estate?.data?.data?.properties?.loanAmount,
                ),
                // نوع آسانسور
                elevatorType: getPropertyValues(
                  estate?.data?.data?.properties?.elevatorType,
                ),
                // تعداد آسانسور نفر بر
                passengerElevatorCount: getConditionalLoanValue(
                  estate?.data?.data?.properties?.passengerElevatorCount,
                ),
                // تعداد آسانسور باری
                freightElevatorCount: getConditionalLoanValue(
                  estate?.data?.data?.properties?.freightElevatorCount,
                ),
              }
            : {
                // مشخصه ملک
                architectureStyle: [],
                architectureStatus: [],
                architectureSpaces: [],
                property: [], // برای مغازه
                // نما ساختمان
                facadeMaterials: [],
                facadeStyle: [],
                // مشاعات
                commonsFeatures: [],
                commonsSpaces: [],
                commonsServices: [],
                // سرمایش و گرمایش
                coolingHeating: [],
                // پوشش‌ها
                floorCovering: [],
                wallAndCeiling: [],
                // آشپزخانه
                kitchenCabinet: [],
                kitchenCabinetPanel: [],
                kitchenEquipment: [],
                kitchenSpaces: [],
                // نوع سرویس بهداشتی
                wcType: [],
                // سایر امکانات و امتیازات
                otherFacilitiesSpaces: [],
                facilities: [],
                points: [],
                parking: [],
                // وضعیت ملک
                documents: [],
                documentType: [],
                residenceStatus: [],
                // تاریخ خروج مستاجر
                tenantExiteDate: undefined,
                // نوع قرارداد
                contractType: [],
                // تاریخ صدور سند
                documentIssueDate: undefined,
                // مقدار وام
                loanAmount: "",
                // نوع آسانسور
                elevatorType: [],
                // تعداد آسانسور نفر بر
                passengerElevatorCount: "",
                // تعداد آسانسور باری
                freightElevatorCount: "",
              },
          banaPrice: estate?.data?.data?.banaPrice
            ? estate?.data?.data?.banaPrice.toString()
            : undefined,
          metragePrice: estate?.data?.data?.metragePrice
            ? formatNumber(estate?.data?.data?.metragePrice.toString())
            : undefined,
          rahnPrice: estate?.data?.data?.rahnPrice
            ? formatNumber(estate?.data?.data?.rahnPrice.toString())
            : undefined,
          ejarePrice: estate?.data?.data?.ejarePrice
            ? formatNumber(estate?.data?.data?.ejarePrice.toString())
            : "0",
          totalPrice: estate?.data?.data?.totalPrice
            ? formatNumber(estate?.data?.data?.totalPrice.toString())
            : undefined,
          buildYear: estate?.data?.data?.buildYear
            ? estate?.data?.data?.buildYear.toString()
            : undefined,
          floorCount: estate?.data?.data?.floorCount
            ? estate?.data?.data?.floorCount.toString()
            : undefined,
          findBy: estate?.data?.data?.findBy || undefined,
          roomCount: estate?.data?.data?.roomCount
            ? estate?.data?.data?.roomCount.toString()
            : undefined,
          floor: estate?.data?.data?.floor || undefined,
          floorUnitCount: estate?.data?.data?.floorUnitCount
            ? estate?.data?.data?.floorUnitCount.toString()
            : undefined,
          adviserId: estate?.data?.data?.adviser?.id || undefined,
          estateNote: "", // در ویرایش از این فیلد استفاده نمی‌کنیم
          ayanMetrage: estate?.data?.data?.ayanMetrage
            ? estate?.data?.data?.ayanMetrage.toString()
            : undefined,
        }
      : undefined,
  });

  // Helper function to transform form properties to backend structure
  const transformPropertiesToBackend = (formProperties: any) => {
    if (!formProperties) return {};

    const transformedProperties: any = {};

    // Get features for this category to get titles
    const dealType = selectedCategories?.[0]?.dealType as DealType;
    const mainCategory = selectedCategories?.[1]?.mainCategory as MainCategory;
    const propertyType = selectedCategories?.[2]?.propertyType as PropertyType;

    const features = getFeaturesForCategories(
      dealType,
      mainCategory,
      propertyType,
    );

    // Helper function to find both title and mainTitle for a label
    const findTitleAndMainTitleForLabel = (
      label: string,
    ): { title: string; mainTitle: string } => {
      for (const categoryKey in features) {
        const featureCategory = features[categoryKey];
        if (!featureCategory?.fields) continue;

        for (const group of featureCategory.fields) {
          if (group.label === label) {
            return {
              title: group.title || featureCategory.title,
              mainTitle: featureCategory.title,
            };
          }
        }
      }
      return { title: label, mainTitle: label }; // fallback to label if not found
    };

    // Transform each property
    Object.entries(formProperties).forEach(([label, values]) => {
      if (
        label === "contractType" &&
        Array.isArray(values) &&
        values.length > 0
      ) {
        // Special handling for contractType - save as structured format
        transformedProperties[label] = {
          title: "نوع قرارداد",
          mainTitle: "وضعیت ملک",
          values: values as string[],
        };
      } else if (
        label === "elevatorType" &&
        Array.isArray(values) &&
        values.length > 0
      ) {
        // Special handling for elevatorType - save as structured format
        transformedProperties[label] = {
          title: "نوع آسانسور",
          mainTitle: "مشاعات عمومی",
          values: values as string[],
        };
      } else if (Array.isArray(values) && values.length > 0) {
        const { title, mainTitle } = findTitleAndMainTitleForLabel(label);
        transformedProperties[label] = {
          title: title,
          mainTitle: mainTitle,
          values: values as string[],
        };
      } else if (label === "tenantExiteDate" && values) {
        // Special handling for tenantExiteDate - save as structured format
        transformedProperties[label] = {
          title: "تاریخ خروج مستاجر",
          mainTitle: "وضعیت ملک",
          values: [values as string],
        };
      } else if (label === "documentIssueDate" && values) {
        // Special handling for documentIssueDate - save as structured format
        transformedProperties[label] = {
          title: "تاریخ صدور سند",
          mainTitle: "وضعیت ملک",
          values: [values as string],
        };
      } else if (label === "loanAmount" && values) {
        // Special handling for loanAmount - save as structured format
        transformedProperties[label] = {
          title: "مقدار وام",
          mainTitle: "وضعیت ملک",
          values: [`${values}`],
        };
      } else if (label === "passengerElevatorCount" && values) {
        // Special handling for passengerElevatorCount - save as structured format
        transformedProperties[label] = {
          title: "تعداد آسانسور نفر بر",
          mainTitle: "مشاعات عمومی",
          values: [values as string],
        };
      } else if (label === "freightElevatorCount" && values) {
        // Special handling for freightElevatorCount - save as structured format
        transformedProperties[label] = {
          title: "تعداد آسانسور باری",
          mainTitle: "مشاعات عمومی",
          values: [values as string],
        };
      }
    });

    return transformedProperties;
  };

  const isAnyFileUploading = watch("files")?.some((file) => !file.url);

  // Helper function to get changed fields for edit requests
  const getChangedFields = (formData: z.infer<typeof mutateEstateSchema>) => {
    if (!isEditing || !estate?.data?.data) return {};

    const originalData = estate.data.data;
    const changes: Record<string, any> = {};

    // Compare form data with original data and collect changes
    if (formData.title !== originalData.title) {
      changes.title = formData.title;
    }

    if (formData.description !== (originalData.description || "")) {
      changes.description = formData.description;
    }

    if (formData.note !== (originalData.note || "")) {
      changes.note = formData.note;
    }

    if (formData.metrage !== originalData.metrage.toString()) {
      changes.metrage = Number(formData.metrage);
    }

    if (formData.address !== originalData.address && canViewAddress) {
      changes.address = formData.address;
    }

    if (formData.approximateAddress !== originalData.approximateAddress) {
      changes.approximateAddress = formData.approximateAddress || "";
    }

    // Price comparisons
    if (
      formData.metragePrice &&
      Number(unFormatNumber(formData.metragePrice)) !==
        originalData.metragePrice &&
      !(selectedCategories?.[0]?.dealType === DealTypeEnum.FOR_RENT)
    ) {
      changes.metragePrice = Number(unFormatNumber(formData.metragePrice));
    }

    if (
      formData.totalPrice &&
      Number(unFormatNumber(formData.totalPrice)) !== originalData.totalPrice &&
      !(selectedCategories?.[0]?.dealType === DealTypeEnum.FOR_RENT)
    ) {
      changes.totalPrice = Number(unFormatNumber(formData.totalPrice));
    }

    if (
      formData.rahnPrice &&
      Number(unFormatNumber(formData.rahnPrice)) !== originalData.rahnPrice &&
      selectedCategories?.[0]?.dealType === DealTypeEnum.FOR_RENT
    ) {
      changes.rahnPrice = Number(unFormatNumber(formData.rahnPrice));
    }

    if (
      formData.ejarePrice &&
      Number(unFormatNumber(formData.ejarePrice)) !== originalData.ejarePrice &&
      selectedCategories?.[0]?.dealType === DealTypeEnum.FOR_RENT
    ) {
      changes.ejarePrice = Number(unFormatNumber(formData.ejarePrice || "0"));
    }

    // Numeric field comparisons
    if (
      formData.buildYear &&
      Number(formData.buildYear) !== originalData.buildYear
    ) {
      changes.buildYear = Number(formData.buildYear);
    }

    if (
      formData.floorCount &&
      Number(formData.floorCount) !== originalData.floorCount
    ) {
      changes.floorCount = Number(formData.floorCount);
    }

    if (
      formData.roomCount &&
      Number(formData.roomCount) !== originalData.roomCount
    ) {
      changes.roomCount = Number(formData.roomCount);
    }

    if (formData.floor !== originalData.floor) {
      changes.floor = formData.floor;
    }

    if (
      formData.floorUnitCount &&
      Number(formData.floorUnitCount) !== originalData.floorUnitCount
    ) {
      changes.floorUnitCount = Number(formData.floorUnitCount);
    }

    // Additional numeric field comparisons
    if (
      formData.floorMetrage &&
      Number(formData.floorMetrage) !== originalData.floorMetrage
    ) {
      changes.floorMetrage = Number(formData.floorMetrage);
    }

    if (
      formData.dahaneMetrage &&
      Number(formData.dahaneMetrage) !== originalData.dahaneMetrage
    ) {
      changes.dahaneMetrage = Number(formData.dahaneMetrage);
    }

    if (formData.height && Number(formData.height) !== originalData.height) {
      changes.height = Number(formData.height);
    }

    if (
      formData.banaMetrage &&
      Number(formData.banaMetrage) !== originalData.banaMetrage
    ) {
      changes.banaMetrage = Number(formData.banaMetrage);
    }

    if (
      formData.soleMetrage &&
      Number(formData.soleMetrage) !== originalData.soleMetrage
    ) {
      changes.soleMetrage = Number(formData.soleMetrage);
    }

    if (
      formData.balkonMetrage &&
      Number(formData.balkonMetrage) !== originalData.balkonMetrage
    ) {
      changes.balkonMetrage = Number(formData.balkonMetrage);
    }

    if (
      formData.parkingCount &&
      Number(formData.parkingCount) !== originalData.parkingCount
    ) {
      changes.parkingCount = Number(formData.parkingCount);
    }

    if (
      formData.ayanMetrage &&
      Number(formData.ayanMetrage) !== originalData.ayanMetrage
    ) {
      changes.ayanMetrage = Number(formData.ayanMetrage);
    }

    // Array comparisons
    if (
      JSON.stringify(formData.location) !==
      JSON.stringify(originalData.location)
    ) {
      changes.location = formData.location;
    }

    // Properties comparison
    if (
      JSON.stringify(formData.properties) !==
      JSON.stringify(originalData.properties)
    ) {
      changes.properties = transformPropertiesToBackend(formData.properties);
    }

    if (formData.findBy !== originalData.findBy) {
      changes.findBy = formData.findBy;
    }

    // Owner comparison (if user has permission to view owners)
    if (canViewOwners && formData.owners) {
      const originalOwnerIds = originalData.owners
        ?.map((owner) => owner.id)
        .sort();
      const newOwnerIds = formData.owners
        ?.map((owner) => owner.ownerId)
        .filter(Boolean)
        .sort();
      if (JSON.stringify(originalOwnerIds) !== JSON.stringify(newOwnerIds)) {
        changes.owners =
          formData.owners?.map((owner) => ({ id: owner.ownerId || "" })) || [];
      }
    }

    // File comparison
    if (formData.files && Array.isArray(formData.files)) {
      const originalFiles = originalData.files || [];
      const newFiles = formData.files.filter((file) => file.url); // Only include uploaded files

      // Compare file arrays by their keys or URLs
      const originalFileKeys = originalFiles.map((file) => file.key).sort();
      const newFileKeys = newFiles.map((file) => file.key).sort();

      const posterIsSelected = formData.files.some((file) => file.isPoster);

      if (JSON.stringify(originalFileKeys) !== JSON.stringify(newFileKeys)) {
        changes.files = newFiles.map((file, index) => ({
          url: file.url,
          file_name: file.file_name,
          key: file.key,
          mimeType: file.mimeType,
          isPoster:
            !posterIsSelected && file.mimeType.includes("image")
              ? index === 0
              : file.isPoster,
        }));
      }
    }

    return changes;
  };

  useEffect(() => {
    if (
      selectedRegion?.id !== estate.data?.data?.category?.id &&
      estate.data?.data?.metrage &&
      selectedCategories?.length
    ) {
      setValue(
        "title",
        createEstateNameByCategories(
          [...(selectedCategories || []), selectedRegion || { name: "" }],
          Number(estate?.data?.data?.metrage?.toString() || "0"),
        ),
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    estate.data?.data,
    selectedRegion?.id,
    selectedCategories,
    selectedRegion,
  ]);

  useEffect(() => {
    if (isEditing && estate.data && firstRender) {
      const defaultCategories = [...estate.data.allParents].reverse();
      setSelectedCategories?.([
        defaultCategories[0],
        defaultCategories[1],
        defaultCategories[2],
      ]);
      setSelectedRegion?.(estate.data.data.category);
      setFirstRender?.(false);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditing, estate.data, setFirstRender, firstRender]);

  const handleFormSubmit = async (data: z.infer<typeof mutateEstateSchema>) => {
    // Check owners validation first
    if (!data.owners?.length && (canViewOwners || !isEditing)) {
      toast.error("مالک ملک را مشخص کنید!");
      setError("owners", { message: "مالک ملک را مشخص کنید!" });
      return;
    }

    if (!data.address && (canViewAddress || !isEditing)) {
      toast.error("آدرس ملک را مشخص کنید!");
      setError("address", { message: "آدرس ملک را مشخص کنید!" });
      return;
    }

    if (selectedCategories?.[0]?.dealType === DealTypeEnum.FOR_RENT) {
      if (!data.rahnPrice) {
        toast.error("قیمت رهن را مشخص کنید!");
        setError("rahnPrice", { message: "قیمت رهن را مشخص کنید!" });
        return;
      } else {
        clearErrors("rahnPrice");
      }
    } else {
      clearErrors("rahnPrice");
    }

    if (
      selectedCategories?.[0]?.dealType === DealTypeEnum.FOR_SALE ||
      selectedCategories?.[0]?.dealType === DealTypeEnum.PRE_SALE ||
      selectedCategories?.[0]?.dealType === DealTypeEnum.PARTICIPATION
    ) {
      if (!data.totalPrice) {
        toast.error("قیمت کل را مشخص کنید!");
        setError("totalPrice", { message: "قیمت کل را مشخص کنید!" });
        return;
      } else {
        clearErrors("totalPrice");
      }
      if (!data.metragePrice) {
        toast.error("قیمت متراژ را مشخص کنید!");
        setError("metragePrice", { message: "قیمت متراژ را مشخص کنید!" });
        return;
      } else {
        clearErrors("metragePrice");
      }
    } else {
      clearErrors("metragePrice");
      clearErrors("totalPrice");
    }

    // Check location validation for applicable categories
    if (
      !data.location.length &&
      shouldShowFieldForCategories(
        AllCreateFileFields.LOCATION,
        selectedCategories || [],
      )
    ) {
      toast.error("موقعیت ملک را مشخص کنید!");
      setError("location", { message: "موقعیت ملک را مشخص کنید!" });
      return;
    }

    // If validation passes, show confirmation modal
    setPendingFormData(data);
    setIsConfirmModalOpen(true);
  };

  const executeSubmit = async (
    switchValue?: boolean,
    requestTitle?: string,
    requestDescription?: string,
  ) => {
    if (!pendingFormData) return;

    const data = pendingFormData;

    const percentage = calculateEstateCompletionPercentage(data, {
      dealType: selectedCategories?.[0]?.dealType as DealType,
      mainCategory: selectedCategories?.[1]?.mainCategory as MainCategory,
      propertyType: selectedCategories?.[2]?.propertyType as PropertyType,
    });

    const posterIsSelected = data.files.some((file) => file.isPoster);

    let res;

    if (isEditing && !canDirectEdit) {
      // Create edit request instead of direct editing
      const changes = getChangedFields(data);

      if (Object.keys(changes).length === 0) {
        toast.error("هیچ تغییری اعمال نشده است");
        return;
      }

      // Validate title and description for edit requests
      if (!requestTitle || !requestDescription) {
        toast.error("عنوان و توضیحات درخواست الزامی است");
        return;
      }

      // Use switchValue to determine estateStatus
      const estateStatus = switchValue
        ? ESTATE_STATUS.PUBLISH
        : ESTATE_STATUS.PENDING;

      res = await createRequest.mutateAsync({
        estateId: id as string,
        type: REQUEST_TYPE.EDIT,
        estateStatus: estateStatus,
        changes: changes,
        title: requestTitle,
        description: requestDescription,
      });

      if (res) {
        queryClient.invalidateQueries({ queryKey: ["createdEstateList"] });
        queryClient.invalidateQueries({ queryKey: ["estateList"] });
        setIsConfirmModalOpen(false);
        setPendingFormData(null);
        const callbackUrl = searchParams.get("callbackUrl");
        if (callbackUrl) {
          router.push(callbackUrl.replace("%", "&"));
        } else {
          if (isUserPanel) {
            router.push(`/user-panel/estates`);
          } else {
            router.push(`/dashboard/estates/manage-estates`);
          }
        }
      }
      return;
    } else if (isEditing) {
      res = await mutateEstate.mutateAsync({
        id: id as string,
        data: {
          estateId: id as string,
          files: data.files.map((file, index) => ({
            url: file.url,
            file_name: file.file_name,
            key: file.key,
            mimeType: file.mimeType,
            isPoster:
              !posterIsSelected && file.mimeType.includes("image")
                ? index === 0
                : file.isPoster,
          })),
          owners:
            data.owners?.map((owner) => ({
              id: owner.ownerId || "",
            })) || [],
          title: data.title,
          description: data.description || "",
          note: data.note || "",
          metrage: Number(data.metrage),
          ...(data.metragePrice &&
          !(selectedCategories?.[0]?.dealType === DealTypeEnum.FOR_RENT)
            ? {
                metragePrice: Number(unFormatNumber(data.metragePrice)),
              }
            : { metragePrice: 0 }),
          ...(data.rahnPrice &&
          selectedCategories?.[0]?.dealType === DealTypeEnum.FOR_RENT
            ? {
                rahnPrice: Number(unFormatNumber(data.rahnPrice)),
              }
            : { rahnPrice: 0 }),
          ...(data.ejarePrice &&
          selectedCategories?.[0]?.dealType === DealTypeEnum.FOR_RENT
            ? {
                ejarePrice: Number(unFormatNumber(data.ejarePrice || "0")),
              }
            : { ejarePrice: 0 }),
          ...(data.totalPrice &&
          !(selectedCategories?.[0]?.dealType === DealTypeEnum.FOR_RENT)
            ? {
                totalPrice: Number(unFormatNumber(data.totalPrice)),
              }
            : { totalPrice: 0 }),
          ...(data.buildYear && { buildYear: Number(data.buildYear) }),
          ...(data.floorCount && { floorCount: Number(data.floorCount) }),
          ...(data.floor && { floor: data.floor }),
          ...(data.floorUnitCount && {
            floorUnitCount: Number(data.floorUnitCount),
          }),
          ...(data.findBy && { findBy: data.findBy }),
          ...(data.address && { address: data.address }),
          ...(data.approximateAddress && {
            approximateAddress: data.approximateAddress || "",
          }),
          ...(data.roomCount && { roomCount: Number(data.roomCount) }),
          ...(data.location && { location: data.location }),
          ...(data.floorMetrage && { floorMetrage: Number(data.floorMetrage) }),
          ...(data.dahaneMetrage && {
            dahaneMetrage: Number(data.dahaneMetrage),
          }),
          ...(data.balkonMetrage && {
            balkonMetrage: Number(data.balkonMetrage),
          }),
          ...(data.height && { height: Number(data.height) }),
          ...(data.inventory && { inventory: Number(data.inventory) }),
          ...(data.arzMelk && { arzMelk: Number(data.arzMelk) }),
          ...(data.arzGozar && { arzGozar: Number(data.arzGozar) }),
          ...(data.tolMelk && { tolMelk: Number(data.tolMelk) }),
          ...(data.banaMetrage && { banaMetrage: Number(data.banaMetrage) }),
          ...(data.soleMetrage && { soleMetrage: Number(data.soleMetrage) }),
          ...(data.categoryId && { categoryId: selectedRegion?.id }),
          ...(data.parkingCount && { parkingCount: Number(data.parkingCount) }),

          ...(data.properties && {
            properties: transformPropertiesToBackend(data.properties),
          }),
          ...(data.adviserId && { adviserId: data.adviserId }),
          ...(data.ayanMetrage && { ayanMetrage: Number(data.ayanMetrage) }),
          percentage: percentage.toString(),
        },
      });
    } else {
      res = await mutateEstate.mutateAsync({
        data: {
          files: data.files.map((file, index) => ({
            url: file.url,
            file_name: file.file_name,
            key: file.key,
            mimeType: file.mimeType,
            isPoster:
              !posterIsSelected && file.mimeType.includes("image")
                ? index === 0
                : file.isPoster,
          })),
          owners:
            data.owners?.map((owner) => ({
              id: owner.ownerId || "",
            })) || [],
          title: data.title,
          description: data.description || "",
          note: data.note || "",
          metrage: Number(data.metrage),
          ...(shouldShowFieldForCategories(
            AllCreateFileFields.METRAGE_PRICE,
            selectedCategories || [],
          ) &&
          data.metragePrice &&
          !(selectedCategories?.[0]?.dealType === DealTypeEnum.FOR_RENT)
            ? {
                metragePrice: Number(unFormatNumber(data.metragePrice)),
              }
            : { metragePrice: 0 }),
          ...(shouldShowFieldForCategories(
            AllCreateFileFields.TOTAL_PRICE,
            selectedCategories || [],
          ) &&
          data.totalPrice &&
          !(selectedCategories?.[0]?.dealType === DealTypeEnum.FOR_RENT)
            ? {
                totalPrice: Number(unFormatNumber(data.totalPrice)),
              }
            : { totalPrice: 0 }),
          ...(shouldShowFieldForCategories(
            AllCreateFileFields.RAHN_PRICE,
            selectedCategories || [],
          ) &&
          data.rahnPrice &&
          selectedCategories?.[0]?.dealType === DealTypeEnum.FOR_RENT
            ? {
                rahnPrice: Number(unFormatNumber(data.rahnPrice)),
              }
            : { rahnPrice: 0 }),
          ...(shouldShowFieldForCategories(
            AllCreateFileFields.EJARE_PRICE,
            selectedCategories || [],
          ) &&
          data.ejarePrice &&
          selectedCategories?.[0]?.dealType === DealTypeEnum.FOR_RENT
            ? {
                ejarePrice: Number(unFormatNumber(data.ejarePrice || "0")),
              }
            : { ejarePrice: 0 }),
          ...(data.buildYear && { buildYear: Number(data.buildYear) }),
          ...(data.floorCount && { floorCount: Number(data.floorCount) }),
          ...(data.floor && { floor: data.floor }),
          ...(data.floorUnitCount && {
            floorUnitCount: Number(data.floorUnitCount),
          }),
          ...(data.findBy && { findBy: data.findBy }),
          ...(data.address && { address: data.address }),
          ...(data.approximateAddress && {
            approximateAddress: data.approximateAddress || "",
          }),
          ...(data.roomCount && { roomCount: Number(data.roomCount) }),
          ...(data.location && { location: data.location }),
          ...(data.floorMetrage && { floorMetrage: Number(data.floorMetrage) }),
          ...(data.dahaneMetrage && {
            dahaneMetrage: Number(data.dahaneMetrage),
          }),
          ...(data.balkonMetrage && {
            balkonMetrage: Number(data.balkonMetrage),
          }),
          ...(data.height && { height: Number(data.height) }),
          ...(data.inventory && { inventory: Number(data.inventory) }),
          ...(data.arzMelk && { arzMelk: Number(data.arzMelk) }),
          ...(data.arzGozar && { arzGozar: Number(data.arzGozar) }),
          ...(data.tolMelk && { tolMelk: Number(data.tolMelk) }),
          ...(data.banaMetrage && { banaMetrage: Number(data.banaMetrage) }),
          ...(data.soleMetrage && { soleMetrage: Number(data.soleMetrage) }),
          ...(data.categoryId && { categoryId: selectedRegion?.id }),
          ...(data.parkingCount && {
            parkingCount: Number(data.parkingCount),
          }),
          ...(data.properties && {
            properties: transformPropertiesToBackend(data.properties),
          }),
          ...(data.ayanMetrage && { ayanMetrage: Number(data.ayanMetrage) }),
          percentage: percentage.toString(),
          ...(data.adviserId && {
            adviserId: data.adviserId || userInfo?.data?.data.id,
          }),
        },
      });
    }

    if (!res) return;

    // اگر در حالت ایجاد هستیم و یادداشت وارد شده، آن را ایجاد کنیم
    if (!isEditing && data.estateNote && data.estateNote.trim() && res.id) {
      await mutateEstateNote.mutateAsync({
        estateId: res.id,
        note: data.estateNote,
      });
    }

    queryClient.invalidateQueries({ queryKey: ["createdEstateList"] });
    queryClient.invalidateQueries({ queryKey: ["estateList"] });

    setIsConfirmModalOpen(false);
    setPendingFormData(null);
    const callbackUrl = searchParams.get("callbackUrl");
    if (callbackUrl) {
      console.log("callbackUrl", callbackUrl.replace("%", "&"));
      router.push(callbackUrl.replace("%", "&"));
    } else {
      if (isUserPanel) {
        router.push(`/user-panel/estates`);
      } else {
        router.push(`/dashboard/estates/manage-estates`);
      }
    }
  };

  console.log(watch("owners"), "OOOOOOOOOOOOOOOOOOOOOOOOOOOOOO");

  if (isEditing && estate.isLoading) {
    return <MutateEstateSkeleton />;
  }

  return (
    <>
      <PanelBodyHeader
        title={isEditing ? "ویرایش فایل" : "ایجاد فایل"}
        breadcrumb={
          <>
            <Link href={`/${isUserPanel ? "user-panel" : "dashboard"}`}>
              داشبورد
            </Link>{" "}
            /{" "}
            <Link
              href={`/${isUserPanel ? "user-panel/estates" : "dashboard/estates/manage-estates"}`}>
              فایل ها
            </Link>{" "}
            / <span>{isEditing ? "ویرایش فایل" : "ایجاد فایل"}</span>
          </>
        }>
        {/* نمایش درصد پر شدن فیلدها */}

        <BorderedButton
          onClick={() => {
            setSelectedCategories?.(null);
            setSelectedRegion?.(null);
          }}
          disabled={mutateEstate.isPending || isAnyFileUploading}>
          {isEditing ? "تغییر دسته بندی" : "بازگشت"}
        </BorderedButton>
        <Button
          className="sticky top-0"
          onClick={handleSubmit(handleFormSubmit)}
          disabled={
            mutateEstate.isPending ||
            createRequest.isPending ||
            isAnyFileUploading
          }
          isLoading={mutateEstate.isPending || createRequest.isPending}>
          {isEditing ? (canDirectEdit ? "ویرایش" : "درخواست ویرایش") : "ایجاد"}
        </Button>
      </PanelBodyHeader>
      <div className="w-full pt-6 md:pt-8 lg:pt-8">
        <div className="flex flex-wrap items-center justify-start gap-2">
          {selectedCategories?.map((category, index) => (
            <React.Fragment key={category.id}>
              {index > 0 && <span className="text-sm text-gray-500">/</span>}

              <p className="text-sm text-gray-500">
                {getCategoryPersianName(category.name || "")}
              </p>
            </React.Fragment>
          ))}
        </div>

        <div className="flex flex-col-reverse items-start gap-6 pt-3 md:gap-8 md:pt-4 lg:gap-10 lg:pt-5 xl:flex-row">
          <EstateInformation
            selectedCategories={selectedCategories ?? []}
            register={register}
            errors={errors}
            setValue={setValue}
            watch={watch}
            control={control}
            selectedRegion={selectedRegion ?? null}
            clearErrors={clearErrors}
            isEditing={isEditing}
            canViewOwners={canViewOwners}
            canViewAddress={canViewAddress}
            defaultEstate={estate.data?.data}
            isUserPanel={isUserPanel}
          />
          <EstateGallery isUserPanel={isUserPanel} control={control} />
        </div>
        <div className="mt-7 flex items-center justify-end gap-3 border-t border-primary-border/50 pt-5">
          <BorderedButton
            onClick={() => {
              setSelectedCategories?.(null);
              setSelectedRegion?.(null);
            }}
            disabled={mutateEstate.isPending || isAnyFileUploading}>
            {isEditing ? "تغییر دسته بندی" : "بازگشت"}
          </BorderedButton>
          <Button
            className="sticky top-0"
            onClick={handleSubmit(handleFormSubmit)}
            disabled={
              mutateEstate.isPending ||
              createRequest.isPending ||
              isAnyFileUploading
            }
            isLoading={mutateEstate.isPending || createRequest.isPending}>
            {isEditing
              ? canDirectEdit
                ? "ویرایش"
                : "درخواست ویرایش"
              : "ایجاد"}
          </Button>
        </div>
      </div>

      {/* Confirmation Modal */}
      <EstateCreateConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => {
          setIsConfirmModalOpen(false);
          setPendingFormData(null);
        }}
        onConfirm={executeSubmit}
        isLoading={mutateEstate.isPending || createRequest.isPending}
        title={
          isEditing
            ? canDirectEdit
              ? "تایید ویرایش فایل"
              : "تایید درخواست ویرایش فایل"
            : "تایید ایجاد فایل"
        }
        description={
          isEditing
            ? canDirectEdit
              ? "آیا از ویرایش این فایل مطمئن هستید؟"
              : "آیا از ارسال درخواست ویرایش این فایل مطمئن هستید؟"
            : "آیا از ایجاد این فایل مطمئن هستید؟"
        }
        actionName={
          isEditing ? (canDirectEdit ? "ویرایش" : "ارسال درخواست") : "ایجاد"
        }
        formData={pendingFormData}
        categoryTypes={
          selectedCategories
            ? {
                dealType: selectedCategories[0]?.dealType as DealType,
                mainCategory: selectedCategories[1]
                  ?.mainCategory as MainCategory,
                propertyType: selectedCategories[2]
                  ?.propertyType as PropertyType,
              }
            : undefined
        }
        isEditRequest={isEditing && !canDirectEdit}
      />
    </>
  );
}
