import PanelBodyHeader from "@/app/(panel)/_components/PanelBodyHeader";
import BorderedButton from "@/components/modules/buttons/BorderedButton";
import Button from "@/components/modules/buttons/Button";
import {
  createEstateNameByCategories,
  getFeaturesForCategories,
} from "@/components/modules/estate/EstateUtils";
import {
  type DealType,
  type MainCategory,
  type PropertyType,
} from "@/lib/categories";
import { unFormatNumber } from "@/lib/utils";
import useMutateEstateNote from "@/services/mutations/admin/estate/note/useMutateEstateNote";
import useUserMutateEstateRequest from "@/services/mutations/client/dashboard/estate/request/useUserMutateEstateRequest";
import { useUserEstateRequest } from "@/services/queries/client/dashboard/estate/request/useUserEstateRequest";
import { type TCategory } from "@/types/admin/category/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import EstateInformation from "./EstateInformation";
import MutateEstateRequestSkeleton from "./MutateEstateRequestSkeleton";

export const mutateEstateRequestSchema = z.object({
  categoryId: z.string().optional(),
  title: z
    .string({ required_error: "عنوان الزامی است" })
    .min(1, "عنوان الزامی است"),
  description: z.string().optional(),
  minMetrage: z.string().optional(),
  maxMetrage: z.string().optional(),
  dahaneMetrage: z.string().optional(),
  height: z.string().optional(),
  roomCount: z.string().optional(),
  floorCount: z.string().optional(),
  floorUnitCount: z.string().optional(),
  minTotalPrice: z.string().optional(),
  maxTotalPrice: z.string().optional(),
  maxRahnPrice: z.string().optional(),
  minRahnPrice: z.string().optional(),
  maxEjarePrice: z.string().optional(),
  minEjarePrice: z.string().optional(),
  maxMetragePrice: z.string().optional(),
  minMetragePrice: z.string().optional(),
  minFloor: z.string().optional(),
  maxFloor: z.string().optional(),
  buildYear: z.string().optional(),
  location: z.array(z.string()).optional(),
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
});

export default function MutateEstateRequest({
  selectedCategories,
  setSelectedCategories,
  setSelectedRegion,
  selectedRegion,
  isEditing,
  setFirstRender,
  firstRender,
}: {
  selectedCategories?: TCategory[];
  setSelectedCategories?: (categories: TCategory[] | null) => void;
  setSelectedRegion?: (region: TCategory | null) => void;
  selectedRegion?: TCategory | null;
  isEditing?: boolean;
  setFirstRender?: (firstRender: boolean) => void;
  firstRender?: boolean;
}) {
  const router = useRouter();
  const { userMutateEstateRequest } = useUserMutateEstateRequest();
  const { mutateEstateNote } = useMutateEstateNote();
  const { id } = useParams<{ id: string }>();
  const { userEstateRequest } = useUserEstateRequest({
    id: id as string,
    enable: isEditing,
  });
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();

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

  const {
    register,
    formState: { errors },
    setValue,
    watch,
    handleSubmit,
  } = useForm<z.infer<typeof mutateEstateRequestSchema>>({
    resolver: zodResolver(mutateEstateRequestSchema),
    defaultValues: {
      categoryId: isEditing ? "" : selectedRegion?.id || "",
      title: isEditing
        ? ""
        : createEstateNameByCategories([
            ...(selectedCategories || []),
            selectedRegion || { name: "" },
          ]),
    },
    values: isEditing
      ? {
          categoryId: userEstateRequest?.data?.data?.category?.id || undefined,
          title: userEstateRequest?.data?.data?.title || "",
          description: userEstateRequest?.data?.data?.description || "",
          ...(userEstateRequest?.data?.data?.description
            ? {
                description: userEstateRequest?.data?.data?.description || "",
              }
            : {}),
          ...(userEstateRequest?.data?.data?.minMetrage
            ? {
                minMetrage:
                  userEstateRequest?.data?.data?.minMetrage?.toString() || "",
              }
            : {}),
          ...(userEstateRequest?.data?.data?.maxMetrage
            ? {
                maxMetrage:
                  userEstateRequest?.data?.data?.maxMetrage?.toString() || "",
              }
            : {}),
          ...(userEstateRequest?.data?.data?.dahaneMetrage
            ? {
                dahaneMetrage:
                  userEstateRequest?.data?.data?.dahaneMetrage?.toString() ||
                  "",
              }
            : {}),
          ...(userEstateRequest?.data?.data?.height
            ? {
                height: userEstateRequest?.data?.data?.height?.toString() || "",
              }
            : {}),
          ...(userEstateRequest?.data?.data?.roomCount
            ? {
                roomCount:
                  userEstateRequest?.data?.data?.roomCount?.toString() || "",
              }
            : {}),
          ...(userEstateRequest?.data?.data?.floorCount
            ? {
                floorCount:
                  userEstateRequest?.data?.data?.floorCount?.toString() || "",
              }
            : {}),
          ...(userEstateRequest?.data?.data?.floorUnitCount
            ? {
                floorUnitCount:
                  userEstateRequest?.data?.data?.floorUnitCount?.toString() ||
                  "",
              }
            : {}),
          ...(userEstateRequest?.data?.data?.minTotalPrice
            ? {
                minTotalPrice:
                  userEstateRequest?.data?.data?.minTotalPrice?.toString() ||
                  "",
              }
            : {}),
          ...(userEstateRequest?.data?.data?.maxTotalPrice
            ? {
                maxTotalPrice:
                  userEstateRequest?.data?.data?.maxTotalPrice?.toString() ||
                  "",
              }
            : {}),
          ...(userEstateRequest?.data?.data?.maxRahnPrice
            ? {
                maxRahnPrice:
                  userEstateRequest?.data?.data?.maxRahnPrice?.toString() || "",
              }
            : {}),
          ...(userEstateRequest?.data?.data?.minRahnPrice
            ? {
                minRahnPrice:
                  userEstateRequest?.data?.data?.minRahnPrice?.toString() || "",
              }
            : {}),
          ...(userEstateRequest?.data?.data?.maxEjarePrice
            ? {
                maxEjarePrice:
                  userEstateRequest?.data?.data?.maxEjarePrice?.toString() ||
                  "",
              }
            : {}),
          ...(userEstateRequest?.data?.data?.minEjarePrice
            ? {
                minEjarePrice:
                  userEstateRequest?.data?.data?.minEjarePrice?.toString() ||
                  "",
              }
            : {}),
          ...(userEstateRequest?.data?.data?.maxMetragePrice
            ? {
                maxMetragePrice:
                  userEstateRequest?.data?.data?.maxMetragePrice?.toString() ||
                  "",
              }
            : {}),
          ...(userEstateRequest?.data?.data?.minMetragePrice
            ? {
                minMetragePrice:
                  userEstateRequest?.data?.data?.minMetragePrice?.toString() ||
                  "",
              }
            : {}),
          ...(userEstateRequest?.data?.data?.minFloor
            ? {
                minFloor:
                  userEstateRequest?.data?.data?.minFloor?.toString() || "",
              }
            : {}),
          ...(userEstateRequest?.data?.data?.maxFloor
            ? {
                maxFloor:
                  userEstateRequest?.data?.data?.maxFloor?.toString() || "",
              }
            : {}),
          ...(userEstateRequest?.data?.data?.buildYear
            ? {
                buildYear:
                  userEstateRequest?.data?.data?.buildYear?.toString() || "",
              }
            : {}),
          location: userEstateRequest?.data?.data?.location || [],

          properties: userEstateRequest?.data?.data?.properties
            ? {
                // مشخصه ملک
                architectureStyle: getPropertyValues(
                  userEstateRequest?.data?.data?.properties.architectureStyle,
                ),
                architectureStatus: getPropertyValues(
                  userEstateRequest?.data?.data?.properties.architectureStatus,
                ),
                architectureSpaces: getPropertyValues(
                  userEstateRequest?.data?.data?.properties.architectureSpaces,
                ),
                property: getPropertyValues(
                  userEstateRequest?.data?.data?.properties.property,
                ), // برای مغازه
                // نما ساختمان
                facadeMaterials: getPropertyValues(
                  userEstateRequest?.data?.data?.properties.facadeMaterials,
                ),
                facadeStyle: getPropertyValues(
                  userEstateRequest?.data?.data?.properties.facadeStyle,
                ),
                // مشاعات
                commonsFeatures: getPropertyValues(
                  userEstateRequest?.data?.data?.properties.commonsFeatures,
                ),
                commonsSpaces: getPropertyValues(
                  userEstateRequest?.data?.data?.properties.commonsSpaces,
                ),
                commonsServices: getPropertyValues(
                  userEstateRequest?.data?.data?.properties.commonsServices,
                ),
                // سرمایش و گرمایش
                coolingHeating: getPropertyValues(
                  userEstateRequest?.data?.data?.properties.coolingHeating,
                ),
                // پوشش‌ها
                floorCovering: getPropertyValues(
                  userEstateRequest?.data?.data?.properties.floorCovering,
                ),
                wallAndCeiling: getPropertyValues(
                  userEstateRequest?.data?.data?.properties.wallAndCeiling,
                ),
                // آشپزخانه
                kitchenCabinet: getPropertyValues(
                  userEstateRequest?.data?.data?.properties.kitchenCabinet,
                ),
                kitchenCabinetPanel: getPropertyValues(
                  userEstateRequest?.data?.data?.properties.kitchenCabinetPanel,
                ),
                kitchenEquipment: getPropertyValues(
                  userEstateRequest?.data?.data?.properties.kitchenEquipment,
                ),
                kitchenSpaces: getPropertyValues(
                  userEstateRequest?.data?.data?.properties.kitchenSpaces,
                ),
                // نوع سرویس بهداشتی
                wcType: getPropertyValues(
                  userEstateRequest?.data?.data?.properties.wcType,
                ),
                // سایر امکانات و امتیازات
                otherFacilitiesSpaces: getPropertyValues(
                  userEstateRequest?.data?.data?.properties
                    .otherFacilitiesSpaces,
                ),
                facilities: getPropertyValues(
                  userEstateRequest?.data?.data?.properties.facilities,
                ),
                points: getPropertyValues(
                  userEstateRequest?.data?.data?.properties.points,
                ),
                parking: getPropertyValues(
                  userEstateRequest?.data?.data?.properties.parking,
                ),
                // وضعیت ملک
                documents: getPropertyValues(
                  userEstateRequest?.data?.data?.properties.documents,
                ),
                documentType: getPropertyValues(
                  userEstateRequest?.data?.data?.properties.documentType,
                ),
                residenceStatus: getPropertyValues(
                  userEstateRequest?.data?.data?.properties.residenceStatus,
                ),
                // تاریخ خروج مستاجر
                tenantExiteDate: getConditionalDateValue(
                  userEstateRequest?.data?.data?.properties?.tenantExiteDate,
                ),
                // نوع قرارداد
                contractType: getPropertyValues(
                  userEstateRequest?.data?.data?.properties.contractType,
                ),
                // تاریخ صدور سند
                documentIssueDate: getConditionalDateValue(
                  userEstateRequest?.data?.data?.properties?.documentIssueDate,
                ),
                // مقدار وام
                loanAmount: getConditionalLoanValue(
                  userEstateRequest?.data?.data?.properties?.loanAmount,
                ),
                // نوع آسانسور
                elevatorType: getPropertyValues(
                  userEstateRequest?.data?.data?.properties?.elevatorType,
                ),
                // تعداد آسانسور نفر بر
                passengerElevatorCount: getConditionalLoanValue(
                  userEstateRequest?.data?.data?.properties
                    ?.passengerElevatorCount,
                ),
                // تعداد آسانسور باری
                freightElevatorCount: getConditionalLoanValue(
                  userEstateRequest?.data?.data?.properties
                    ?.freightElevatorCount,
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

  useEffect(() => {
    if (isEditing && userEstateRequest?.data?.data && firstRender) {
      const defaultCategories = [
        ...userEstateRequest?.data?.allParents,
      ].reverse();
      setSelectedCategories?.([
        defaultCategories[0],
        defaultCategories[1],
        defaultCategories[2],
      ]);
      setSelectedRegion?.(userEstateRequest?.data?.data.category);
      setFirstRender?.(false);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditing, userEstateRequest?.data?.data, setFirstRender, firstRender]);

  const handleFormSubmit = async (
    data: z.infer<typeof mutateEstateRequestSchema>,
  ) => {
    executeSubmit(data);
  };

  const executeSubmit = async (
    data: z.infer<typeof mutateEstateRequestSchema>,
  ) => {
    let res;

    if (isEditing) {
      res = await userMutateEstateRequest.mutateAsync({
        data: {
          id: userEstateRequest?.data?.data?.id,
          title: data.title,
          description: data.description || "",
          minMetrage: Number(data.minMetrage) || undefined,
          maxMetrage: Number(data.maxMetrage) || undefined,
          dahaneMetrage: Number(data.dahaneMetrage) || undefined,
          height: Number(data.height) || undefined,
          roomCount: Number(data.roomCount) || undefined,
          floorCount: Number(data.floorCount) || undefined,
          floorUnitCount: Number(data.floorUnitCount) || undefined,
          ...(unFormatNumber(data.minTotalPrice || "") && {
            minTotalPrice: Number(unFormatNumber(data.minTotalPrice || "")),
          }),
          ...(unFormatNumber(data.maxTotalPrice || "") && {
            maxTotalPrice: Number(unFormatNumber(data.maxTotalPrice || "")),
          }),
          ...(unFormatNumber(data.maxRahnPrice || "") && {
            maxRahnPrice: Number(unFormatNumber(data.maxRahnPrice || "")),
          }),
          ...(unFormatNumber(data.minRahnPrice || "") && {
            minRahnPrice: Number(unFormatNumber(data.minRahnPrice || "")),
          }),
          ...(unFormatNumber(data.maxEjarePrice || "") && {
            maxEjarePrice: Number(unFormatNumber(data.maxEjarePrice || "")),
          }),
          ...(unFormatNumber(data.minEjarePrice || "") && {
            minEjarePrice: Number(unFormatNumber(data.minEjarePrice || "")),
          }),
          ...(unFormatNumber(data.maxMetragePrice || "") && {
            maxMetragePrice: Number(unFormatNumber(data.maxMetragePrice || "")),
          }),
          ...(unFormatNumber(data.minMetragePrice || "") && {
            minMetragePrice: Number(unFormatNumber(data.minMetragePrice || "")),
          }),
          minFloor: data.minFloor || undefined,
          maxFloor: data.maxFloor || undefined,
          buildYear: Number(data.buildYear) || undefined,
          location: data.location || undefined,
          properties: transformPropertiesToBackend(data.properties),
          categoryId: selectedRegion?.id?.toString() || "",
        },
      });
    } else {
      res = await userMutateEstateRequest.mutateAsync({
        data: {
          title: data.title,
          description: data.description || "",
          minMetrage: Number(data.minMetrage) || undefined,
          maxMetrage: Number(data.maxMetrage) || undefined,
          dahaneMetrage: Number(data.dahaneMetrage) || undefined,
          height: Number(data.height) || undefined,
          roomCount: Number(data.roomCount) || undefined,
          floorCount: Number(data.floorCount) || undefined,
          floorUnitCount: Number(data.floorUnitCount) || undefined,
          ...(unFormatNumber(data.minTotalPrice || "") && {
            minTotalPrice: Number(unFormatNumber(data.minTotalPrice || "")),
          }),
          ...(unFormatNumber(data.maxTotalPrice || "") && {
            maxTotalPrice: Number(unFormatNumber(data.maxTotalPrice || "")),
          }),
          ...(unFormatNumber(data.maxRahnPrice || "") && {
            maxRahnPrice: Number(unFormatNumber(data.maxRahnPrice || "")),
          }),
          ...(unFormatNumber(data.minRahnPrice || "") && {
            minRahnPrice: Number(unFormatNumber(data.minRahnPrice || "")),
          }),
          ...(unFormatNumber(data.maxEjarePrice || "") && {
            maxEjarePrice: Number(unFormatNumber(data.maxEjarePrice || "")),
          }),
          ...(unFormatNumber(data.minEjarePrice || "") && {
            minEjarePrice: Number(unFormatNumber(data.minEjarePrice || "")),
          }),
          ...(unFormatNumber(data.maxMetragePrice || "") && {
            maxMetragePrice: Number(unFormatNumber(data.maxMetragePrice || "")),
          }),
          ...(unFormatNumber(data.minMetragePrice || "") && {
            minMetragePrice: Number(unFormatNumber(data.minMetragePrice || "")),
          }),
          minFloor: data.minFloor || undefined,
          maxFloor: data.maxFloor || undefined,
          buildYear: Number(data.buildYear) || undefined,
          location: data.location || undefined,
          properties: transformPropertiesToBackend(data.properties),
          categoryId: selectedRegion?.id?.toString() || "",
        },
      });
    }

    if (!res) return;

    // اگر در حالت ایجاد هستیم و یادداشت وارد شده، آن را ایجاد کنیم
    if (!isEditing && data.description && data.description.trim() && res.id) {
      await mutateEstateNote.mutateAsync({
        estateId: res.id,
        note: data.description,
      });
    }

    queryClient.invalidateQueries({ queryKey: ["userEstateRequestList"] });
    queryClient.invalidateQueries({ queryKey: ["userEstateRequest"] });

    const callbackUrl = searchParams.get("callbackUrl");
    if (callbackUrl) {
      router.push(callbackUrl.replace("%" , "&"));
    } else {
      router.push(`/user-panel/estate-request`);
    }
  };

  if (isEditing && userEstateRequest?.isLoading) {
    return <MutateEstateRequestSkeleton />;
  }

  return (
    <>
      <PanelBodyHeader
        title={isEditing ? "ویرایش درخواست ملک" : "ایجاد درخواست ملک"}
        breadcrumb={
          <>
            <Link href="user-panel">داشبورد</Link> /{" "}
            <Link href="user-panel/estate-request">درخواست ملک</Link> /{" "}
            <span>
              {isEditing ? "ویرایش درخواست ملک" : "ایجاد درخواست ملک"}
            </span>
          </>
        }>
        {/* نمایش درصد پر شدن فیلدها */}

        <BorderedButton
          onClick={() => {
            setSelectedCategories?.(null);
            setSelectedRegion?.(null);
          }}
          disabled={userMutateEstateRequest.isPending}>
          {isEditing ? "تغییر دسته بندی" : "بازگشت"}
        </BorderedButton>
        <Button
          className="sticky top-0"
          onClick={handleSubmit(handleFormSubmit)}
          disabled={
            userMutateEstateRequest.isPending ||
            userMutateEstateRequest.isPending
          }
          isLoading={
            userMutateEstateRequest.isPending ||
            userMutateEstateRequest.isPending
          }>
          {isEditing ? "ویرایش" : "ایجاد"}
        </Button>
      </PanelBodyHeader>
      <div className="w-full">
        <div className="flex flex-col-reverse items-start gap-6 pt-6 md:gap-8 md:pt-8 lg:gap-10 lg:pt-10 xl:flex-row">
          <EstateInformation
            selectedCategories={selectedCategories ?? []}
            register={register}
            errors={errors}
            setValue={setValue}
            watch={watch}
            defaultEstate={userEstateRequest?.data?.data}
          />
        </div>
        <div className="mt-7 flex items-center justify-end gap-3 border-t border-primary-border/50 pt-5">
          <BorderedButton
            onClick={() => {
              setSelectedCategories?.(null);
              setSelectedRegion?.(null);
            }}
            disabled={userMutateEstateRequest.isPending}>
            {isEditing ? "تغییر دسته بندی" : "بازگشت"}
          </BorderedButton>
          <Button
            className="sticky top-0"
            onClick={handleSubmit(handleFormSubmit)}
            disabled={
              userMutateEstateRequest.isPending ||
              userMutateEstateRequest.isPending
            }
            isLoading={
              userMutateEstateRequest.isPending ||
              userMutateEstateRequest.isPending
            }>
            {isEditing ? "ویرایش" : "ایجاد"}
          </Button>
        </div>
      </div>
    </>
  );
}
