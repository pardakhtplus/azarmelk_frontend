import { type TCategory } from "@/types/admin/category/types";

// Type definitions for URL serialization
export type SerializableCategory = {
  id?: string;
  name?: string;
  dealType?: string;
  propertyType?: string;
  mainCategory?: string;
  parentId?: string;
};

export type SerializableRegion = {
  key: string;
  title: string;
  parent?: { id: string; title: string };
};

/**
 * Serialize categories array to URL-safe string
 */
export function serializeCategories(
  categories: (Partial<TCategory> & { parents?: { id?: string }[] })[],
): string {
  if (!categories || categories.length === 0) return "";

  const serializable = categories.map(
    (cat): SerializableCategory => ({
      id: cat.id,
      name: cat.name,
      dealType: cat.dealType,
      propertyType: cat.propertyType || undefined,
      mainCategory: cat.mainCategory || undefined,
      parentId: cat.parentId || undefined,
    }),
  );

  return encodeURIComponent(JSON.stringify(serializable));
}

/**
 * Deserialize categories from URL string
 */
export function deserializeCategories(
  categoriesString: string,
): (Partial<TCategory> & { parents?: { id?: string }[] })[] {
  if (!categoriesString) return [];

  try {
    const parsed = JSON.parse(
      decodeURIComponent(categoriesString),
    ) as SerializableCategory[];
    return parsed.map((cat) => ({
      id: cat.id,
      name: cat.name,
      dealType: cat.dealType,
      propertyType: cat.propertyType,
      mainCategory: cat.mainCategory,
      parentId: cat.parentId,
      // We'll rebuild parents array from context when needed
      parents: [],
    }));
  } catch (error) {
    console.warn("Failed to parse categories from URL:", error);
    return [];
  }
}

/**
 * Serialize regions array to URL-safe string
 */
export function serializeRegions(regions: SerializableRegion[]): string {
  if (!regions || regions.length === 0) return "";

  return encodeURIComponent(JSON.stringify(regions));
}

/**
 * Deserialize regions from URL string
 */
export function deserializeRegions(
  regionsString: string,
): SerializableRegion[] {
  if (!regionsString) return [];

  try {
    return JSON.parse(
      decodeURIComponent(regionsString),
    ) as SerializableRegion[];
  } catch (error) {
    console.warn("Failed to parse regions from URL:", error);
    return [];
  }
}
