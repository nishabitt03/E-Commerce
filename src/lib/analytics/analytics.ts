import { mockAnalyticsProvider } from "@/lib/analytics/mock-analytics";
import type { AnalyticsEvent, AnalyticsPayloadMap } from "@/types/analytics";

/**
 * Typed event entry point. UI and stores call this; providers are swappable.
 */
export function trackEvent<E extends AnalyticsEvent>(
  eventName: E,
  payload: AnalyticsPayloadMap[E]
): void {
  mockAnalyticsProvider(eventName, payload);
}
