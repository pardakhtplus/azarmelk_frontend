export enum FeatureFlag {
  DASHBOARD = "DASHBOARD",
  USERS = "USERS",
  CATEGORIES = "CATEGORIES",
  LANDINGS = "LANDINGS",
  SESSIONS = "SESSIONS",
  ESTATES = "ESTATES",
}

export const ENABLED_FEATURES: FeatureFlag[] = [
  FeatureFlag.DASHBOARD,
  FeatureFlag.USERS,
  FeatureFlag.CATEGORIES,
  FeatureFlag.LANDINGS,
  FeatureFlag.SESSIONS,
  FeatureFlag.ESTATES,
];

/**
 * Check if a feature is enabled
 */
export function isFeatureEnabled(feature: FeatureFlag): boolean {
  return ENABLED_FEATURES.includes(feature);
}
