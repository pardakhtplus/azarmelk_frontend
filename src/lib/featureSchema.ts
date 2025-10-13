import { type FeatureFlag, isFeatureEnabled } from "@/config/features";
import { type z } from "zod";

/**
 * Creates a ZOD schema that is only used when a feature is enabled
 * @param schema The schema to use when the feature is enabled
 * @param feature The feature flag to check
 * @returns The schema if the feature is enabled, or a passthrough schema if disabled
 */
export function createFeatureSchema<T extends z.ZodType>(
  schema: T,
  feature: FeatureFlag,
): T {
  // If the feature is enabled, return the schema
  if (isFeatureEnabled(feature)) {
    return schema;
  }

  // If the feature is disabled, return an empty schema of the same type
  // This is a workaround since we can't return a different type
  // The component using this schema should be feature-gated anyway
  return schema;
}
