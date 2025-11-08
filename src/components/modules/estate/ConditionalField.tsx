"use client";

import {
  type AllCreateFileFields,
  filteredCreateFileFields,
} from "@/components/modules/estate/EstateUtils";
import { type TCategory } from "@/types/admin/category/types";
import { DealType, MainCategory, PropertyType } from "@/lib/categories";

// ============================================================================
// TYPES AND INTERFACES
// ============================================================================

interface ConditionalFieldProps {
  field: AllCreateFileFields;
  selectedCategories: TCategory[];
  children: React.ReactNode;
}

// ============================================================================
// LOOKUP MAPS FOR PERFORMANCE
// ============================================================================

const DEAL_TYPE_MAP: Record<string, DealType> = {
  فروش: DealType.FOR_SALE,
  اجاره: DealType.FOR_RENT,
  پیش‌فروش: DealType.PRE_SALE,
  مشارکت: DealType.PARTICIPATION,
};

const MAIN_CATEGORY_MAP: Record<string, MainCategory> = {
  مسکونی: MainCategory.RESIDENTIAL,
  تجاری: MainCategory.COMMERCIAL,
  صنعتی: MainCategory.INDUSTRIAL,
  خدماتی: MainCategory.SERVICE,
  "باغ/ویلا": MainCategory.VILLA,
};

const PROPERTY_TYPE_MAP: Record<string, PropertyType> = {
  [PropertyType.APARTMENT]: PropertyType.APARTMENT,
  [PropertyType.SHOP]: PropertyType.SHOP,
  [PropertyType.OFFICE_CLINIC]: PropertyType.OFFICE_CLINIC,
  [PropertyType.HOTEL]: PropertyType.HOTEL,
  [PropertyType.VILLA]: PropertyType.VILLA,
  [PropertyType.REAL_ESTATE]: PropertyType.REAL_ESTATE,
  [PropertyType.LAND]: PropertyType.LAND,
  [PropertyType.VILLA_LAND]: PropertyType.VILLA_LAND,
  [PropertyType.WORKSHOP_FACTORY]: PropertyType.WORKSHOP_FACTORY,
  [PropertyType.WAREHOUSE_HALL]: PropertyType.WAREHOUSE_HALL,
  [PropertyType.BASEMENT]: PropertyType.BASEMENT,
  [PropertyType.COLD_STORAGE]: PropertyType.COLD_STORAGE,
  [PropertyType.GAS_STATION]: PropertyType.GAS_STATION,
  [PropertyType.REAL_ESTATE_LAND]: PropertyType.REAL_ESTATE_LAND,
};

// ============================================================================
// TRANSLATION MAPS
// ============================================================================

const FIELD_NAMES: Record<string, string> = {
  title: "عنوان",
  description: "توضیحات",
  note: "یادداشت",
  metrage: "متراژ",
  soleMetrage: "متراژ سوله",
  buildYear: "سال ساخت",
  floorCount: "تعداد طبقات",
  floor: "طبقه",
  floorUnitCount: "تعداد واحد در طبقه",
  findBy: "فایل یابی از طریق",
  address: "آدرس",
  // approximateAddress: "آدرس تقریبی",
  roomCount: "تعداد اتاق",
  location: "موقعیت ملک",
  floorMetrage: "متراژ کف",
  dahaneMetrage: "متراژ دهنه",
  height: "ارتفاع سقف",
  inventory: "انبار تجاری",
  arzMelk: "عرض ملک",
  arzGozar: "عرض گذر",
  tolMelk: "طول ملک",
  banaMetrage: "متراژ بنا",
  banaPrice: "قیمت بنا",
  totalPrice: "قیمت کل",
  metragePrice: "قیمت هر متر",
  rahnPrice: "قیمت رهن",
  ejarePrice: "قیمت اجاره",
  property: "مشخصه ملک",
  wcType: "نوع سرویس بهداشتی",
  wallAndCeiling: "دیوار و سقف",
  parkingType: "نوع پارکینگ",
  parkingCount: "تعداد پارکینگ",
  estateStatus: "وضعیت ملک",
  points: "امتیازات",
  facade: "نما ساختمان",
  commons: "مشاعات",
  coolingHeating: "سرمایش و گرمایش",
  floorCovering: "پوشش کف",
  kitchenType: "نوع آشپزخانه",
  residenceStatus: "وضعیت سکونت",
  tenantExitDate: "تاریخ خروج مستاجر",
  tenantExiteDate: "تاریخ خروج مستاجر",
  otherFacilities: "سایر امکانات",
  status: "وضعیت انتشار",
  files: "فایل ها",

  // Property fields - ویژگی‌های معماری
  "properties.architectureStyle": "ویژگی‌های معماری/سبک",
  "properties.architectureStatus": "ویژگی‌های معماری/وضعیت",
  "properties.architectureSpaces": "ویژگی‌های معماری/فضاها",
  "properties.property": "مشخصه ملک",

  // نما ساختمان
  "properties.facadeMaterials": "نمای ساختمان/مصالح",
  "properties.facadeStyle": "نمای ساختمان/سبک",

  // مشاعات
  "properties.commonsFeatures": "مشاعات عمومی/امکانات تفریحی",
  "properties.commonsSpaces": "مشاعات عمومی/فضاهای خارجی",
  "properties.commonsServices": "مشاعات عمومی/امنیت و خدمات",

  // سرمایش و گرمایش
  "properties.coolingHeating": "سرمایش و گرمایش",

  // پوشش‌ها
  "properties.floorCovering": "پوشش‌ها/کف",
  "properties.wallAndCeiling": "پوشش‌ها/سقف و دیوار",

  // آشپزخانه
  "properties.kitchenCabinet": "آشپزخانه/کابینت",
  "properties.kitchenCabinetPanel": "آشپزخانه/صفحه کابینت",
  "properties.kitchenEquipment": "آشپزخانه/تجهیزات",
  "properties.kitchenSpaces": "آشپزخانه/فضاها",

  // نوع سرویس بهداشتی
  "properties.wcType": "سرویس بهداشتی",

  // سایر امکانات و امتیازات
  "properties.otherFacilitiesSpaces": "سایر امکانات/فضاها",
  "properties.facilities": "سایر امکانات/امکانات",
  "properties.points": "سایر امکانات/امتیازات",
  "properties.parking": "سایر امکانات/پارکینگ",

  // وضعیت ملک
  "properties.documents": "وضعیت ملک/سند",
  "properties.documentType": "وضعیت ملک/نوع سند",
  "properties.residenceStatus": "وضعیت ملک/وضعیت سکونت",

  // فیلدهای خاص
  "properties.tenantExiteDate": "تاریخ خروج مستاجر",
  "properties.contractType": "نوع قرارداد",
  "properties.documentIssueDate": "تاریخ صدور سند",
  "properties.loanAmount": "مقدار وام",

  // فیلدهای آسانسور
  "properties.elevatorType": "مشاعات عمومی/نوع آسانسور",
  "properties.passengerElevatorCount": "مشاعات عمومی/تعداد آسانسور نفر بر",
  "properties.freightElevatorCount": "مشاعات عمومی/تعداد آسانسور باری",
};

const CATEGORY_NAMES: Record<string, string> = {
  // Deal types
  FOR_SALE: "فروش",
  FOR_RENT: "اجاره",
  PARTICIPATION: "مشارکت",
  PRE_SALE: "پیش‌فروش",

  // Main categories
  RESIDENTIAL: "مسکونی",
  COMMERCIAL: "تجاری",
  INDUSTRIAL: "صنعتی",
  SERVICE: "خدماتی",
  VILLA: "باغ/ویلا",

  // Property types
  APARTMENT: "آپارتمان",
  REAL_ESTATE_LAND: "مستغلات / زمین",
  OFFICE_CLINIC: "دفتر کار / مطب",
  REAL_ESTATE: "مستغلات",
  HOTEL: "هتل",
  SHOP: "مغازه",
  LAND: "زمین",
  WORKSHOP_FACTORY: "کارگاه / کارخونه",
  WAREHOUSE_HALL: "انبار / سوله",
  BASEMENT: "زیر زمین",
  GAS_STATION: "پمپ بنزین",
  VILLA_LAND: "زمین ویلایی",
  COLD_STORAGE: "سردخانه",
};

// ============================================================================
// CATEGORY EXTRACTION FUNCTIONS
// ============================================================================

/**
 * استخراج نوع معامله از دسته‌بندی‌های انتخاب شده
 */
function extractDealType(categories: TCategory[]): DealType | null {
  const dealTypeCategory = categories.find(
    (cat) =>
      DEAL_TYPE_MAP[cat.name] ||
      Object.values(DealType).includes(cat.dealType as DealType),
  );

  if (!dealTypeCategory) return null;

  return (
    DEAL_TYPE_MAP[dealTypeCategory.name] ||
    (dealTypeCategory.dealType as DealType)
  );
}

/**
 * استخراج دسته اصلی از دسته‌بندی‌های انتخاب شده
 */
function extractMainCategory(categories: TCategory[]): MainCategory | null {
  const mainCatCategory = categories.find((cat) => MAIN_CATEGORY_MAP[cat.name]);

  return mainCatCategory ? MAIN_CATEGORY_MAP[mainCatCategory.name] : null;
}

/**
 * استخراج نوع ملک از دسته‌بندی‌های انتخاب شده
 */
function extractPropertyType(categories: TCategory[]): PropertyType | null {
  const propTypeCategory = categories.find(
    (cat) => PROPERTY_TYPE_MAP[cat.name],
  );

  return propTypeCategory ? PROPERTY_TYPE_MAP[propTypeCategory.name] : null;
}

/**
 * استخراج تمام اطلاعات دسته‌بندی از آرایه دسته‌بندی‌ها
 */
function extractCategoryInfo(categories: TCategory[]) {
  return {
    dealType: extractDealType(categories),
    mainCategory: extractMainCategory(categories),
    propertyType: extractPropertyType(categories),
  };
}

/**
 * Gets all fields that should be shown based on the selected categories
 * @param dealType The selected deal type (فروش، اجاره، پیش‌فروش، مشارکت)
 * @param mainCategory The selected main category (مسکونی، تجاری، صنعتی، خدماتی، باغ/ویلا)
 * @param propertyType The selected property type (آپارتمان، مغازه، زمین، ...)
 * @returns Array of fields that should be shown
 */
export function getVisibleFields(
  dealType: DealType,
  mainCategory: MainCategory,
  propertyType: PropertyType,
): AllCreateFileFields[] {
  // Find the matching category configuration
  const matchingConfig = filteredCreateFileFields.find(
    (config) =>
      config.dealType.includes(dealType) &&
      config.mainCategory.includes(mainCategory) &&
      config.propertyType.includes(propertyType),
  );

  // If no matching configuration is found, return empty array
  if (!matchingConfig) {
    return [];
  }

  // Return the fields array of the matching configuration
  return matchingConfig.fields;
}

/**
 * Checks if a field should be shown based on the selected categories
 * @param field The field to check
 * @param dealType The selected deal type (فروش، اجاره، پیش‌فروش، مشارکت)
 * @param mainCategory The selected main category (مسکونی، تجاری، صنعتی، خدماتی، باغ/ویلا)
 * @param propertyType The selected property type (آپارتمان، مغازه، زمین، ...)
 * @returns boolean indicating whether the field should be shown
 */
export function shouldShowField(
  field: AllCreateFileFields,
  dealType: DealType,
  mainCategory: MainCategory,
  propertyType: PropertyType,
): boolean {
  // Find the matching category configuration
  const matchingConfig = filteredCreateFileFields.find(
    (config) =>
      config.dealType.includes(dealType) &&
      config.mainCategory.includes(mainCategory) &&
      config.propertyType.includes(propertyType),
  );

  // If no matching configuration is found, return false
  if (!matchingConfig) {
    return false;
  }

  // Check if the field is included in the fields array of the matching configuration
  return matchingConfig.fields.includes(field);
}

// ============================================================================
// CONFIGURATION MATCHING FUNCTIONS
// ============================================================================

/**
 * پیدا کردن پیکربندی منطبق با دسته‌بندی‌های انتخابی
 */
function findMatchingConfig(
  dealType: DealType,
  mainCategory: MainCategory,
  propertyType: PropertyType,
) {
  return filteredCreateFileFields.find(
    (config) =>
      config.dealType.includes(dealType) &&
      config.mainCategory.includes(mainCategory) &&
      config.propertyType.includes(propertyType),
  );
}

// ============================================================================
// PUBLIC API FUNCTIONS
// ============================================================================

/**
 * بررسی می‌کند آیا فیلد مورد نظر باید برای دسته‌بندی‌های انتخاب شده نمایش داده شود یا خیر
 */
export function shouldShowFieldForCategories(
  field: AllCreateFileFields,
  selectedCategories: TCategory[],
): boolean {
  const { dealType, mainCategory, propertyType } =
    extractCategoryInfo(selectedCategories);

  if (!dealType || !mainCategory || !propertyType) {
    return false;
  }

  const matchingConfig = findMatchingConfig(
    dealType,
    mainCategory,
    propertyType,
  );
  return matchingConfig?.fields.includes(field) ?? false;
}

/**
 * دریافت لیست فیلدهای مربوط به دسته‌بندی‌های انتخابی
 */
export function getFieldsForCategories(
  selectedCategories: TCategory[],
): AllCreateFileFields[] {
  const { dealType, mainCategory, propertyType } =
    extractCategoryInfo(selectedCategories);

  if (!dealType || !mainCategory || !propertyType) {
    return [];
  }

  const matchingConfig = findMatchingConfig(
    dealType,
    mainCategory,
    propertyType,
  );
  return matchingConfig?.fields ?? [];
}

/**
 * دریافت نام فارسی فیلد بر اساس نام انگلیسی
 */
export function getFieldPersianName(fieldName: string): string {
  return FIELD_NAMES[fieldName] || fieldName;
}

/**
 * دریافت نام فارسی دسته‌بندی بر اساس نام انگلیسی
 */
export function getCategoryPersianName(categoryName: string): string {
  return CATEGORY_NAMES[categoryName] || categoryName;
}

// ============================================================================
// REACT COMPONENT
// ============================================================================

/**
 * کامپوننتی که به صورت شرطی فرزندان خود را بر اساس اینکه آیا فیلد مشخص شده
 * باید برای دسته‌بندی‌های انتخاب شده نمایش داده شود یا خیر، رندر می‌کند.
 */
export default function ConditionalField({
  field,
  selectedCategories,
  children,
}: ConditionalFieldProps) {
  const shouldShow = shouldShowFieldForCategories(field, selectedCategories);

  return shouldShow ? <>{children}</> : null;
}
