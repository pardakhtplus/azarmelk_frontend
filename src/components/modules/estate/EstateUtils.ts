import {
  getCategoryPersianName,
  getFieldPersianName,
} from "@/components/modules/estate/ConditionalField";
import {
  ESTATE_ARCHIVE_STATUS,
  ESTATE_STATUS,
  FILTER_ESTATE_STATUS,
} from "@/enums";
import {
  DealType,
  MainCategory,
  PropertyType,
  PropertyTypeEnum,
} from "@/lib/categories";
import {
  basementProperty,
  serviceEstateStatus,
  shopOtherFacilities,
  shopProperty,
  shopWcType,
  standardCommons,
  standardCoolingHeating,
  standardEstateStatus,
  standardFacade,
  standardFloorCovering,
  standardKitchenType,
  standardOtherFacilities,
  standardProperty,
  standardWcType,
  type FeatureCategory,
} from "./FeatureItems";

// ============================================================================
// FIELD DATA ARRAYS (برای استفاده در فرم‌ها)
// ============================================================================

// فایل یابی از طریق
export const findBy = [
  "دیوار",
  "مشتری",
  "مشتری حضوری",
  "میدانی",
  "تراکت",
  "پیامک",
];

// موقعیت ملک (این مورد در فعالیت‌ها استفاده نمی‌شود پس نگه داریم)
export const melkLocation = ["شمالی", "جنوبی", "شرقی", "غربی"];
export const shopLocation = ["داخل پاساژ", "داخل بازار", "براصلی", "داخل کوچه"];

// وضعیت سکونت (برای سازگاری با کدهای موجود نگه داریم)
export const residenceStatus = ["سکونت مالک", "سکونت مستاجر", "تخلیه"];

// طبقه
export const floor = [
  "-5",
  "-4",
  "-3",
  "-2",
  "-1",
  "زیرزمین",
  "همکف",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "17",
  "18",
  "19",
  "20",
  "21",
  "22",
  "23",
  "24",
  "25",
  "26",
  "27",
  "28",
  "29",
  "30",
];

// ============================================================================
// FIELD ENUM DEFINITIONS
// ============================================================================

export enum AllCreateFileFields {
  METRAGE = "metrage", // متراژ - متراژ عرصه یا متراژ کل
  SOLE_METRAGE = "soleMetrage", // متراژ سوله
  BUILD_YEAR = "buildYear", // سال ساخت
  FLOOR_COUNT = "floorCount", // تعداد طبقات
  FLOOR = "floor", // طبقه
  FLOOR_UNIT_COUNT = "floorUnitCount", // تعداد واحد در طبقه
  FIND_BY = "findBy", // فایل یابی از طریق
  ADDRESS = "address", // آدرس
  APPROXIMATE_ADDRESS = "approximateAddress", // آدرس تقریبی
  ROOM_COUNT = "roomCount", // تعداد اتاق
  LOCATION = "location", // موقعیت ملک
  FLOOR_METRAGE = "floorMetrage", // متراژ کف
  DAHANE_METRAGE = "dahaneMetrage", // متراژ دهنه
  HEIGHT = "height", // ارتفاع سقف
  INVENTORY = "inventory", // انبار تجاری
  ARZ_MELK = "arzMelk", // عرض ملک
  ARZ_GOZAR = "arzGozar", // عرض گذر
  TOL_MELK = "tolMelk", // طول ملک
  BANA_METRAGE = "banaMetrage", // متراژ بنا
  TOTAL_PRICE = "totalPrice", // قیمت کل
  METRAGE_PRICE = "metragePrice", // قیمت هر متر
  RAHN_PRICE = "rahnPrice", // قیمت رهن
  EJARE_PRICE = "ejarePrice", // قیمت اجاره
  PROPERTY = "property", // مشخصه ملک
  WC_TYPE = "wcType", // نوع سرویس بهداشتی
  WALL_AND_CEILING = "wallAndCeiling", // دیوار و سقف
  PARKING_TYPE = "parkingType", // نوع پارکینگ
  PARKING_COUNT = "parkingCount", // تعداد پارکینگ
  ESTATE_STATUS = "estateStatus", // وضعیت ملک
  POINTS = "points", // امتیازات
  FACADE = "facade", // نما ساختمان
  COMMONS = "commons", // مشاعات
  COOLING_HEATING = "coolingHeating", // سرمایش و گرمایش
  FLOOR_COVERING = "floorCovering", // پوشش کف
  KITCHEN_TYPE = "kitchenType", // نوع آشپزخانه
  RESIDENCE_STATUS = "residenceStatus", // وضعیت سکونت
  TENANT_EXIT_DATE = "tenantExitDate", // تاریخ خروج مستاجر
  OTHER_FACILITIES = "otherFacilities", // سایر امکانات
  STATUS = "status", // وضعیت انتشار
  AYAN_METRAGE = "ayanMetrage", // متراژ اعیان
  ARCHIVE_STATUS = "archiveStatus", // وضعیت آرشیو
  OWNERS = "owners", // مالک ها
}

// ============================================================================
// FIELD SETS FOR DIFFERENT PROPERTY TYPES
// ============================================================================

// فیلدهای مشترک که در همه دسته‌بندی‌ها نمایش داده می‌شوند
const commonFields = [
  AllCreateFileFields.ADDRESS,
  AllCreateFileFields.APPROXIMATE_ADDRESS,
];

// فیلدهای قیمت که در همه دسته‌بندی‌ها باید باشند
const priceFields = [
  AllCreateFileFields.TOTAL_PRICE,
  AllCreateFileFields.METRAGE_PRICE,
  AllCreateFileFields.RAHN_PRICE,
  AllCreateFileFields.EJARE_PRICE,
];

const standardResidentialFields = [
  ...commonFields,
  AllCreateFileFields.METRAGE,
  AllCreateFileFields.BUILD_YEAR,
  AllCreateFileFields.FLOOR_COUNT,
  AllCreateFileFields.FLOOR,
  AllCreateFileFields.FLOOR_UNIT_COUNT,
  AllCreateFileFields.FIND_BY,
  AllCreateFileFields.ROOM_COUNT,
  AllCreateFileFields.LOCATION,
  AllCreateFileFields.PARKING_COUNT,
  ...priceFields,
];

const commercialShopFields = [
  ...commonFields,
  AllCreateFileFields.METRAGE,
  AllCreateFileFields.BUILD_YEAR,
  AllCreateFileFields.FLOOR_COUNT,
  AllCreateFileFields.FLOOR,
  AllCreateFileFields.FLOOR_UNIT_COUNT,
  AllCreateFileFields.FIND_BY,
  AllCreateFileFields.LOCATION,
  AllCreateFileFields.FLOOR_METRAGE,
  AllCreateFileFields.DAHANE_METRAGE,
  AllCreateFileFields.HEIGHT,
  AllCreateFileFields.INVENTORY,
  AllCreateFileFields.PARKING_COUNT,
  ...priceFields,
];

const realEstateLandFields = [
  ...commonFields,
  AllCreateFileFields.METRAGE,
  AllCreateFileFields.ARZ_GOZAR,
  AllCreateFileFields.ARZ_MELK,
  AllCreateFileFields.TOL_MELK,
  AllCreateFileFields.ROOM_COUNT,
  AllCreateFileFields.FLOOR_COUNT,
  AllCreateFileFields.FIND_BY,
  AllCreateFileFields.LOCATION,
  AllCreateFileFields.AYAN_METRAGE,
  ...priceFields,
];

const landFields = [
  ...commonFields,
  AllCreateFileFields.METRAGE,
  AllCreateFileFields.ARZ_GOZAR,
  AllCreateFileFields.ARZ_MELK,
  AllCreateFileFields.TOL_MELK,
  AllCreateFileFields.FIND_BY,
  AllCreateFileFields.LOCATION,
  AllCreateFileFields.AYAN_METRAGE,
  ...priceFields,
];

const basementFields = [
  ...commonFields,
  AllCreateFileFields.METRAGE,
  AllCreateFileFields.BUILD_YEAR,
  AllCreateFileFields.FIND_BY,
  ...priceFields,
];

const industrialFields = [
  ...commonFields,
  AllCreateFileFields.METRAGE,
  AllCreateFileFields.BUILD_YEAR,
  AllCreateFileFields.SOLE_METRAGE,
  AllCreateFileFields.HEIGHT,
  AllCreateFileFields.FIND_BY,
  ...priceFields,
];

const villaFields = [
  ...commonFields,
  ...standardResidentialFields,
  AllCreateFileFields.ARZ_MELK,
  AllCreateFileFields.TOL_MELK,
  AllCreateFileFields.AYAN_METRAGE,
];

const gasStationFields = [
  ...commonFields,
  AllCreateFileFields.METRAGE,
  AllCreateFileFields.BUILD_YEAR,
  AllCreateFileFields.FIND_BY,
  ...priceFields,
];

// ============================================================================
// FIELD CONFIGURATION FOR DIFFERENT CATEGORIES
// ============================================================================

export const filteredCreateFileFeatures = [
  // همه (زمین)
  {
    dealType: [
      DealType.FOR_SALE,
      DealType.FOR_RENT,
      DealType.PRE_SALE,
      DealType.PARTICIPATION,
    ],
    mainCategory: [
      MainCategory.COMMERCIAL,
      MainCategory.INDUSTRIAL,
      MainCategory.VILLA,
      MainCategory.SERVICE,
      MainCategory.RESIDENTIAL,
    ],
    propertyType: [PropertyType.LAND, PropertyType.VILLA_LAND],
    features: {},
  },

  // دسته بندی هایی که امکانات ندارن (کارگاه/کارخانه/سوله/انبار/سردخانه/پمپ بنزین/هتل)
  {
    dealType: [
      DealType.FOR_SALE,
      DealType.FOR_RENT,
      DealType.PRE_SALE,
      DealType.PARTICIPATION,
    ],
    mainCategory: [
      MainCategory.COMMERCIAL,
      MainCategory.INDUSTRIAL,
      MainCategory.VILLA,
      MainCategory.SERVICE,
      MainCategory.RESIDENTIAL,
    ],
    propertyType: [
      PropertyType.HOTEL,
      PropertyType.GAS_STATION,
      PropertyType.WORKSHOP_FACTORY,
      PropertyType.WAREHOUSE_HALL,
      PropertyType.COLD_STORAGE,
    ],
    features: {},
  },

  // فروش ٬ اجاره و پیشفروش تجاری (مغازه)
  {
    dealType: [DealType.FOR_SALE, DealType.FOR_RENT, DealType.PRE_SALE],
    mainCategory: [MainCategory.COMMERCIAL],
    propertyType: [PropertyType.SHOP],
    features: {
      property: shopProperty,
      facade: standardFacade,
      floorCovering: standardFloorCovering,
      coolingHeating: standardCoolingHeating,
      wcType: shopWcType,
      otherFacilities: shopOtherFacilities,
      estateStatus: standardEstateStatus,
    },
  },

  // فروش ٬ اجاره و پیشفروش تجاری (زیرزمین)
  {
    dealType: [DealType.FOR_SALE, DealType.FOR_RENT, DealType.PRE_SALE],
    mainCategory: [MainCategory.COMMERCIAL],
    propertyType: [PropertyType.BASEMENT],
    features: {
      property: basementProperty,
      facade: standardFacade,
      floorCovering: standardFloorCovering,
      coolingHeating: standardCoolingHeating,
      wcType: shopWcType,
      otherFacilities: shopOtherFacilities,
      estateStatus: standardEstateStatus,
    },
  },

  // فروش ٬ اجاره و پیشفروش مسکونی (آپارتمان)
  {
    dealType: [DealType.FOR_SALE, DealType.FOR_RENT, DealType.PRE_SALE],
    mainCategory: [MainCategory.RESIDENTIAL],
    propertyType: [PropertyType.APARTMENT],
    features: {
      property: standardProperty,
      facade: standardFacade,
      floorCovering: standardFloorCovering,
      coolingHeating: standardCoolingHeating,
      kitchenType: standardKitchenType,
      wcType: standardWcType,
      commons: standardCommons,
      otherFacilities: standardOtherFacilities,
      estateStatus: standardEstateStatus,
    },
  },

  // فروش ٬ اجاره و پیشفروش خدماتی (مطب ٬ مستغلات . مستغلات/زمین)
  {
    dealType: [DealType.FOR_SALE, DealType.FOR_RENT, DealType.PRE_SALE],
    mainCategory: [MainCategory.SERVICE],
    propertyType: [
      PropertyType.OFFICE_CLINIC,
      PropertyType.REAL_ESTATE,
      PropertyType.REAL_ESTATE_LAND,
    ],
    features: {
      property: standardProperty,
      facade: standardFacade,
      floorCovering: standardFloorCovering,
      coolingHeating: standardCoolingHeating,
      kitchenType: standardKitchenType,
      wcType: standardWcType,
      commons: standardCommons,
      otherFacilities: standardOtherFacilities,
      estateStatus: serviceEstateStatus,
    },
  },

  // فروش ٬ اجاره و پیشفروش مسکونی (آپارتمان)
  {
    dealType: [DealType.FOR_SALE, DealType.FOR_RENT, DealType.PRE_SALE],
    mainCategory: [
      MainCategory.RESIDENTIAL,
      MainCategory.VILLA,
      MainCategory.SERVICE,
      MainCategory.COMMERCIAL,
      MainCategory.INDUSTRIAL,
    ],
    propertyType: [
      PropertyType.VILLA,
      PropertyType.REAL_ESTATE,
      PropertyType.REAL_ESTATE_LAND,
    ],
    features: {
      property: standardProperty,
      facade: standardFacade,
      floorCovering: standardFloorCovering,
      coolingHeating: standardCoolingHeating,
      kitchenType: standardKitchenType,
      wcType: standardWcType,
      otherFacilities: standardOtherFacilities,
      estateStatus: standardEstateStatus,
    },
  },

  // فروش ٬ اجاره و پیشفروش تجاری (مغازه و زیرزمین)
  {
    dealType: [DealType.FOR_SALE, DealType.FOR_RENT, DealType.PRE_SALE],
    mainCategory: [MainCategory.COMMERCIAL],
    propertyType: [PropertyType.SHOP, PropertyType.BASEMENT],
    features: {
      property: standardProperty,
      floorCovering: standardFloorCovering,
      coolingHeating: standardCoolingHeating,
      estateStatus: standardEstateStatus,
    },
  },
];

export const filteredCreateFileFields = [
  // 1. فروش ٬ اجاره و پیشفروش مسکونی و خدماتی (آپارتمان ٬ دفتر کار ٬ مطب ٬ هتل ٬ ویلا)
  {
    dealType: [DealType.FOR_SALE, DealType.FOR_RENT, DealType.PRE_SALE],
    mainCategory: [
      MainCategory.RESIDENTIAL,
      MainCategory.SERVICE,
      MainCategory.VILLA,
    ],
    propertyType: [
      PropertyType.APARTMENT,
      PropertyType.OFFICE_CLINIC,
      PropertyType.HOTEL,
      PropertyType.VILLA,
    ],
    fields: standardResidentialFields,
  },

  // 2. فروش ٬ اجاره و پیشفروش تجاری (مغازه)
  {
    dealType: [DealType.FOR_SALE, DealType.FOR_RENT, DealType.PRE_SALE],
    mainCategory: [MainCategory.COMMERCIAL],
    propertyType: [PropertyType.SHOP],
    fields: commercialShopFields,
  },

  // 3. فروش ٬ اجاره و مشارکت مسکونی و خدماتی و تجاری و صنعتی و باغ/ویلا (زمین / زمین ویلایی)
  {
    dealType: [DealType.FOR_SALE, DealType.PARTICIPATION, DealType.FOR_RENT],
    mainCategory: [
      MainCategory.RESIDENTIAL,
      MainCategory.SERVICE,
      MainCategory.COMMERCIAL,
      MainCategory.INDUSTRIAL,
      MainCategory.VILLA,
    ],
    propertyType: [PropertyType.LAND, PropertyType.VILLA_LAND],
    fields: landFields,
  },

  // 3. فروش ٬ اجاره و مشارکت مسکونی و خدماتی و تجاری و صنعتی و باغ/ویلا (مستغلات/زمین/زمین ویلایی)
  {
    dealType: [DealType.FOR_SALE, DealType.FOR_RENT, DealType.PARTICIPATION],
    mainCategory: [
      MainCategory.RESIDENTIAL,
      MainCategory.SERVICE,
      MainCategory.COMMERCIAL,
      MainCategory.INDUSTRIAL,
      MainCategory.VILLA,
    ],
    propertyType: [
      PropertyType.REAL_ESTATE,
      PropertyType.VILLA_LAND,
      PropertyType.REAL_ESTATE_LAND,
    ],
    fields: realEstateLandFields,
  },

  // 4. فروش ٬ اجاره و پیش‌فروش تجاری (زیرزمین)
  {
    dealType: [DealType.FOR_SALE, DealType.FOR_RENT, DealType.PRE_SALE],
    mainCategory: [MainCategory.COMMERCIAL],
    propertyType: [PropertyType.BASEMENT],
    fields: basementFields,
  },

  // 5. فروش ٬ اجاره و پیش‌فروش صنعتی (کارگاه/کارخانه/سوله/انبار/سردخانه)
  {
    dealType: [DealType.FOR_SALE, DealType.FOR_RENT, DealType.PRE_SALE],
    mainCategory: [MainCategory.INDUSTRIAL],
    propertyType: [
      PropertyType.WORKSHOP_FACTORY,
      PropertyType.WAREHOUSE_HALL,
      PropertyType.COLD_STORAGE,
    ],
    fields: industrialFields,
  },

  // 10. ویلا - باغ/ویلا
  {
    dealType: [DealType.FOR_SALE, DealType.FOR_RENT, DealType.PRE_SALE],
    mainCategory: [MainCategory.VILLA],
    propertyType: [PropertyType.VILLA],
    fields: villaFields,
  },

  // 11. پمپ بنزین
  {
    dealType: [DealType.FOR_SALE, DealType.FOR_RENT],
    mainCategory: [MainCategory.COMMERCIAL, MainCategory.SERVICE],
    propertyType: [PropertyType.GAS_STATION],
    fields: gasStationFields,
  },
];

// ============================================================================
// UTILITY FUNCTIONS FOR ESTATE NAME GENERATION
// ============================================================================

export const createEstateNameByCategories = (
  categories: { name: string }[],
  metrage?: number,
) => {
  return `${categories?.[0]?.name} ${categories?.[2]?.name} ${categories?.[1]?.name} ${metrage ? `${metrage} متر` : ""} در ${categories?.[3]?.name || ""} ${categories?.[4]?.name || ""}`;
};

// ============================================================================
// FIELD COMPLETION PERCENTAGE CALCULATION
// ============================================================================

// فیلدهایی که جزء امکانات محسوب نمی‌شوند و در محاسبه درصد پر شدن حساب می‌شوند
const coreFields = [
  "title",
  "files",
  AllCreateFileFields.METRAGE,
  AllCreateFileFields.ADDRESS,
  AllCreateFileFields.APPROXIMATE_ADDRESS,
  AllCreateFileFields.LOCATION,
  AllCreateFileFields.BUILD_YEAR,
  AllCreateFileFields.FLOOR_COUNT,
  AllCreateFileFields.FLOOR,
  AllCreateFileFields.FLOOR_UNIT_COUNT,
  AllCreateFileFields.FIND_BY,
  AllCreateFileFields.ROOM_COUNT,
  AllCreateFileFields.FLOOR_METRAGE,
  AllCreateFileFields.DAHANE_METRAGE,
  AllCreateFileFields.HEIGHT,
  AllCreateFileFields.INVENTORY,
  AllCreateFileFields.ARZ_MELK,
  AllCreateFileFields.ARZ_GOZAR,
  AllCreateFileFields.TOL_MELK,
  AllCreateFileFields.BANA_METRAGE,
  AllCreateFileFields.SOLE_METRAGE,
  AllCreateFileFields.PARKING_COUNT,
];

// ============================================================================
// FIELD NAME MAPPINGS (Persian names for fields)
// ============================================================================

/**
 * بررسی فیلدهای ناقص
 * @param formData - داده‌های فرم
 * @param categoryTypes - دسته‌بندی‌های انتخاب شده
 * @returns آرایه‌ای از فیلدهای ناقص با نام فارسی
 */
export const getIncompleteFields = (
  formData: any,
  categoryTypes: {
    dealType: DealType;
    mainCategory: MainCategory;
    propertyType: PropertyType;
  },
): { field: string; persianName: string }[] => {
  if (!categoryTypes) {
    return [];
  }

  // پیدا کردن فیلدهای مورد نیاز برای دسته‌بندی انتخاب شده
  let requiredFields: string[] = [];

  const dealTypeName = categoryTypes.dealType;
  const mainCategoryName = categoryTypes.mainCategory;
  const propertyTypeName = categoryTypes.propertyType;

  const dealType = getCategoryPersianName(dealTypeName || "") as DealType;
  const mainCategory = getCategoryPersianName(
    mainCategoryName || "",
  ) as MainCategory;
  const propertyType = getCategoryPersianName(
    propertyTypeName || "",
  ) as PropertyType;

  if (dealType && mainCategory && propertyType) {
    const fieldConfig = filteredCreateFileFields.find(
      (config) =>
        config.dealType.includes(dealType) &&
        config.mainCategory.includes(mainCategory) &&
        config.propertyType.includes(propertyType),
    );

    if (fieldConfig) {
      requiredFields = fieldConfig.fields.filter((field) =>
        coreFields.includes(field),
      );
    }
  }

  // اگر فیلدهای مورد نیاز پیدا نشد، از فیلدهای اصلی استفاده کن
  if (requiredFields.length === 0) {
    requiredFields = coreFields;
  }

  // اضافه کردن فیلدهای اجباری
  const mandatoryFields = ["title", "metrage", "approximateAddress", "files"];

  // ترکیب فیلدهای مورد نیاز و اجباری
  const allRequiredFields = [
    ...new Set([...requiredFields, ...mandatoryFields]),
  ];

  const incompleteFields: { field: string; persianName: string }[] = [];

  allRequiredFields.forEach((field) => {
    const value = formData[field];
    let isFieldComplete = false;

    if (field === "owners") {
      // برای مالکان، بررسی می‌کنیم که حداقل یک مالک وجود داشته باشد
      if (
        value &&
        Array.isArray(value) &&
        value.length > 0 &&
        value[0]?.ownerId
      ) {
        isFieldComplete = true;
      }
    } else if (Array.isArray(value)) {
      // برای آرایه‌ها، بررسی می‌کنیم که خالی نباشند
      if (value && value.length > 0) {
        isFieldComplete = true;
      }
    } else if (typeof value === "string") {
      // برای رشته‌ها، بررسی می‌کنیم که خالی نباشند
      if (value && value.trim().length > 0) {
        isFieldComplete = true;
      }
    } else if (value !== undefined && value !== null) {
      // برای سایر انواع، بررسی می‌کنیم که تعریف شده باشند
      isFieldComplete = true;
    } else if (field === "files") {
      if (value && value.length > 0) {
        isFieldComplete = true;
      }
    }

    if (!isFieldComplete) {
      incompleteFields.push({
        field,
        persianName: getFieldPersianName(field) || field,
      });
    }
  });

  return incompleteFields;
};

/**
 * محاسبه درصد پر شدن فیلدهای اصلی (غیر از امکانات)
 * @param formData - داده‌های فرم
 * @param selectedCategories - دسته‌بندی‌های انتخاب شده
 * @returns درصد پر شدن فیلدها (0-100)
 */
export const calculateEstateCompletionPercentage = (
  formData: any,
  categoryTypes: {
    dealType: DealType;
    mainCategory: MainCategory;
    propertyType: PropertyType;
  },
): number => {
  if (!categoryTypes) {
    return 0;
  }

  // پیدا کردن فیلدهای مورد نیاز برای دسته‌بندی انتخاب شده
  let requiredFields: string[] = [];

  // بررسی دسته‌بندی‌ها و تعیین فیلدهای مورد نیاز
  // استفاده از نام دسته‌بندی‌ها برای تطبیق با enum ها
  const dealTypeName = categoryTypes.dealType;
  const mainCategoryName = categoryTypes.mainCategory;
  const propertyTypeName = categoryTypes.propertyType;

  const dealType = getCategoryPersianName(dealTypeName || "") as DealType;
  const mainCategory = getCategoryPersianName(
    mainCategoryName || "",
  ) as MainCategory;
  const propertyType = getCategoryPersianName(
    propertyTypeName || "",
  ) as PropertyType;

  console.log(dealType, mainCategory, propertyType, "dealType, mainCategory, propertyType");


  if (dealType && mainCategory && propertyType) {
    const fieldConfig = filteredCreateFileFields.find(
      (config) =>
        config.dealType.includes(dealType) &&
        config.mainCategory.includes(mainCategory) &&
        config.propertyType.includes(propertyType),
    );

    if (fieldConfig) {
      requiredFields = fieldConfig.fields.filter((field) =>
        coreFields.includes(field),
      );
    }
  }

  console.log(requiredFields, "requiredFields");

  // اگر فیلدهای مورد نیاز پیدا نشد، از فیلدهای اصلی استفاده کن
  if (requiredFields.length === 0) {
    requiredFields = coreFields;
  }

  // اضافه کردن فیلدهای اجباری
  const mandatoryFields = ["title", "metrage", "approximateAddress", "files"];

  // ترکیب فیلدهای مورد نیاز و اجباری
  const allRequiredFields = [
    ...new Set([...requiredFields, ...mandatoryFields]),
  ];

  let filledFieldsCount = 0;
  const totalFieldsCount = allRequiredFields.length;

  allRequiredFields.forEach((field) => {
    const value = formData[field];

    console.log(field, value, "field, value");

    if (field === "owners") {
      // برای مالکان، بررسی می‌کنیم که حداقل یک مالک وجود داشته باشد
      if (
        value &&
        Array.isArray(value) &&
        value.length > 0 &&
        value[0]?.ownerId
      ) {
        filledFieldsCount++;
      }
    } else if (Array.isArray(value)) {
      // برای آرایه‌ها، بررسی می‌کنیم که خالی نباشند
      if (value && value.length > 0) {
        filledFieldsCount++;
      }
    } else if (typeof value === "string") {
      // برای رشته‌ها، بررسی می‌کنیم که خالی نباشند
      if (value && value.trim().length > 0) {
        filledFieldsCount++;
      }
    }else if (typeof value === "number") {
      if (value && value > 0) {
        filledFieldsCount++;
      }
    }
    else if (value !== undefined && value !== null) {
      // برای سایر انواع، بررسی می‌کنیم که تعریف شده باشند
      filledFieldsCount++;
    } else if (field === "files") {
      if (value && value.length > 0) {
        filledFieldsCount++;
      }
    }
  });

  // محاسبه درصد
  const percentage = Math.round((filledFieldsCount / totalFieldsCount) * 100);
  return Math.min(percentage, 100); // حداکثر 100 درصد
};

// ============================================================================
// FEATURE TYPES
// ============================================================================

export interface FeatureItems {
  property?: FeatureCategory;
  facade?: FeatureCategory;
  commons?: FeatureCategory;
  coolingHeating?: FeatureCategory;
  floorCovering?: FeatureCategory;
  kitchenType?: FeatureCategory;
  wcType?: FeatureCategory;
  wallAndCeiling?: FeatureCategory;
  otherFacilities?: FeatureCategory;
  residenceStatus?: FeatureCategory;
  parkingType?: FeatureCategory;
  estateStatus?: FeatureCategory;
  points?: FeatureCategory;
  landType?: FeatureCategory;
}

/**
 * گرفتن آیتم‌های امکانات برای دسته‌بندی خاص
 */
export function getFeaturesForCategories(
  dealType: DealType,
  mainCategory: MainCategory,
  propertyType: PropertyType,
): FeatureItems {
  const dealTypePersian = getCategoryPersianName(dealType);
  const mainCategoryPersian = getCategoryPersianName(mainCategory);
  const propertyTypePersian = getCategoryPersianName(propertyType);

  const fieldConfig = filteredCreateFileFeatures.find((config) => {
    return (
      config.dealType.includes(dealTypePersian as DealType) &&
      config.mainCategory.includes(mainCategoryPersian as MainCategory) &&
      config.propertyType.includes(
        propertyTypePersian === "باغ/ویلا"
          ? PropertyType.VILLA
          : (propertyTypePersian as PropertyType),
      )
    );
  });

  return fieldConfig?.features || {};
}

export function getEstateStatus(
  status?: ESTATE_STATUS,
  archiveStatus?: ESTATE_ARCHIVE_STATUS,
) {
  let actualStatus: FILTER_ESTATE_STATUS | undefined = undefined;

  // PUBLISH
  if (status === ESTATE_STATUS.PUBLISH && !archiveStatus) {
    actualStatus = FILTER_ESTATE_STATUS.PUBLISH;
  }

  // PENDING
  if (status === ESTATE_STATUS.PENDING && !archiveStatus) {
    actualStatus = FILTER_ESTATE_STATUS.PENDING;
  }

  // ARCHIVE
  if (
    status === ESTATE_STATUS.PUBLISH &&
    archiveStatus === ESTATE_ARCHIVE_STATUS.ARCHIVE
  ) {
    actualStatus = FILTER_ESTATE_STATUS.ARCHIVE;
  }

  // DELETE
  if (
    status === ESTATE_STATUS.PUBLISH &&
    archiveStatus === ESTATE_ARCHIVE_STATUS.DELETE
  ) {
    actualStatus = FILTER_ESTATE_STATUS.DELETE;
  }

  return {
    actualStatus,
  };
}

export const getDefaultPosterFileByCategory = (params: {
  propertyType: PropertyTypeEnum;
}) => {
  if (
    params.propertyType === PropertyTypeEnum.WORKSHOP_FACTORY ||
    params.propertyType === PropertyTypeEnum.COLD_STORAGE ||
    params.propertyType === PropertyTypeEnum.WAREHOUSE_HALL
  ) {
    return `/images/estates/factory.jpg`;
  }
  if (params.propertyType === PropertyTypeEnum.APARTMENT) {
    return `/images/estates/house.jpg`;
  }
  if (
    params.propertyType === PropertyTypeEnum.LAND ||
    params.propertyType === PropertyTypeEnum.REAL_ESTATE ||
    params.propertyType === PropertyTypeEnum.REAL_ESTATE_LAND ||
    params.propertyType === PropertyTypeEnum.VILLA_LAND ||
    params.propertyType === PropertyTypeEnum.BASEMENT
  ) {
    return `/images/estates/land.jpg`;
  }
  if (
    params.propertyType === PropertyTypeEnum.OFFICE_CLINIC ||
    params.propertyType === PropertyTypeEnum.GAS_STATION ||
    params.propertyType === PropertyTypeEnum.HOTEL
  ) {
    return `/images/estates/service.jpg`;
  }
  if (params.propertyType === PropertyTypeEnum.SHOP) {
    return `/images/estates/shop.jpg`;
  }
  if (params.propertyType === PropertyTypeEnum.VILLA) {
    return `/images/estates/villa.jpg`;
  }
  return "";
};

// Helper function to get status label and styling
export const getStatusInfo = (
  status: ESTATE_STATUS,
  archiveStatus: ESTATE_ARCHIVE_STATUS,
) => {
  const isPending = status === ESTATE_STATUS.PENDING;
  const isPublish = status === ESTATE_STATUS.PUBLISH;
  const isArchive = archiveStatus === ESTATE_ARCHIVE_STATUS.ARCHIVE;
  const isDelete = archiveStatus === ESTATE_ARCHIVE_STATUS.DELETE;

  const mainStatus = isArchive
    ? {
        label: "بایگانی",
        bgColor: "bg-gray-500/90",
        textColor: "text-white",
      }
    : isDelete
      ? {
          label: "حذف",
          bgColor: "bg-red/90",
          textColor: "text-white",
        }
      : isPending
        ? {
            label: "غیر فعال",
            bgColor: "bg-orange-500/90",
            textColor: "text-white",
          }
        : isPublish
          ? {
              label: "فعال",
              bgColor: "bg-green-500/90",
              textColor: "text-white",
            }
          : null;

  const publishStatus = isPublish
    ? {
        label: "فعال",
        bgColor: "bg-green-500/90",
        textColor: "text-white",
      }
    : isPending
      ? {
          label: "غیر فعال",
          bgColor: "bg-orange-500/90",
          textColor: "text-white",
        }
      : null;

  const archiveStatusValue = isArchive
    ? {
        label: "بایگانی",
        bgColor: "bg-gray-500/90",
        textColor: "text-white",
      }
    : isDelete
      ? {
          label: "حذف",
          bgColor: "bg-red/90",
          textColor: "text-white",
        }
      : null;

  return {
    mainStatus,
    publishStatus,
    archiveStatus: archiveStatusValue,
  };
};
