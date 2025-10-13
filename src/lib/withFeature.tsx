import { type FeatureFlag, isFeatureEnabled } from "@/config/features";
import { type ComponentType } from "react";

/**
 * Higher-order component that conditionally renders a component based on a feature flag
 * @param Component The component to render if the feature is enabled
 * @param feature The feature flag to check
 * @returns A new component that only renders if the feature is enabled
 */
export function withFeature<P extends object>(
  Component: ComponentType<P>,
  feature: FeatureFlag,
): ComponentType<P> {
  // Return a new component that checks the feature flag
  return function FeatureGatedComponent(props: P) {
    // If the feature is disabled, return null
    if (!isFeatureEnabled(feature)) {
      return null;
    }

    // If the feature is enabled, render the component
    return <Component {...props} />;
  };
}
