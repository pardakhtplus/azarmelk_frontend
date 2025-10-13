export enum DealType {
  FOR_SALE = "فروش", /// فروش
  FOR_RENT = "اجاره", /// اجاره
  PARTICIPATION = "مشارکت", /// مشارکت
  PRE_SALE = "پیش‌فروش", /// پیش‌فروش
}

export enum DealTypeEnum {
  FOR_SALE = "FOR_SALE", /// فروش
  FOR_RENT = "FOR_RENT", /// اجاره
  PARTICIPATION = "PARTICIPATION", /// مشارکت
  PRE_SALE = "PRE_SALE", /// پیش‌فروش
}

export enum MainCategory {
  RESIDENTIAL = "مسکونی", // مسکونی
  COMMERCIAL = "تجاری", //تجاری
  INDUSTRIAL = "صنعتی", // صنعتی
  SERVICE = "خدماتی", // خدماتی
  VILLA = "باغ/ویلا", // باغ/ویلا
}

export enum MainCategoryEnum {
  RESIDENTIAL = "RESIDENTIAL", // مسکونی
  COMMERCIAL = "COMMERCIAL", //تجاری
  INDUSTRIAL = "INDUSTRIAL", // صنعتی
  SERVICE = "SERVICE", // خدماتی
  VILLA = "VILLA", // باغ/ویلا
}

export enum PropertyType {
  APARTMENT = "آپارتمان", //آپارتمان,
  REAL_ESTATE_LAND = "مستغلات / زمین", //مستغلات / زمین,
  OFFICE_CLINIC = "دفتر کار / مطب", //دفتر کار / مطب,
  REAL_ESTATE = "مستغلات", //مستغلات,
  HOTEL = "هتل", //هتل,
  SHOP = "مغازه", //مغازه,
  LAND = "زمین", //زمین,
  VILLA = "ویلا", //ویلا,
  WORKSHOP_FACTORY = "کارگاه / کارخونه", //کارگاه / کارخونه,
  WAREHOUSE_HALL = "انبار / سوله", //انبار / سوله,
  BASEMENT = "زیر زمین", //زیر زمین,
  GAS_STATION = "پمپ بنزین", //پمپ بنزین,
  VILLA_LAND = "زمین ویلایی", //زمین ویلایی,
  COLD_STORAGE = "سردخانه", //سردخانه
}

export enum PropertyTypeEnum {
  APARTMENT = "APARTMENT", //آپارتمان,
  REAL_ESTATE_LAND = "REAL_ESTATE_LAND", //مستغلات / زمین,
  OFFICE_CLINIC = "OFFICE_CLINIC", //دفتر کار / مطب,
  REAL_ESTATE = "REAL_ESTATE", //مستغلات,
  HOTEL = "HOTEL", //هتل,
  SHOP = "SHOP", //مغازه,
  LAND = "LAND", //زمین,
  VILLA = "VILLA", //ویلا,
  WORKSHOP_FACTORY = "WORKSHOP_FACTORY", //کارگاه / کارخونه,
  WAREHOUSE_HALL = "WAREHOUSE_HALL", //انبار / سوله,
  BASEMENT = "BASEMENT", //زیر زمین,
  GAS_STATION = "GAS_STATION", //پمپ بنزین,
  VILLA_LAND = "VILLA_LAND", //زمین ویلایی,
  COLD_STORAGE = "COLD_STORAGE", //سردخانه
}

/**
 * Convert Persian deal type name to English enum key
 */
export function getEnglishDealType(persianName: string): DealType | undefined {
  const entry = Object.entries(DealType).find(
    ([_, value]) => value === persianName,
  );
  return entry ? (entry[0] as DealType) : undefined;
}

/**
 * Convert Persian main category name to English enum key
 */
export function getEnglishMainCategory(
  persianName: string,
): MainCategory | undefined {
  const entry = Object.entries(MainCategory).find(
    ([_, value]) => value === persianName,
  );
  return entry ? (entry[0] as MainCategory) : undefined;
}

/**
 * Convert Persian property type name to English enum key
 */
export function getEnglishPropertyType(
  persianName: string,
): PropertyType | undefined {
  const entry = Object.entries(PropertyType).find(
    ([_, value]) => value === persianName,
  );
  return entry ? (entry[0] as PropertyType) : undefined;
}
