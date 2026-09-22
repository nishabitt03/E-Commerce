import type { AnalyticsEvent, AnalyticsPayloadMap } from "@/types/analytics";

/**
 * Mock GA4/GTM sink. Swap this for a real provider later without changing UI calls.
 */
export function mockAnalyticsProvider<E extends AnalyticsEvent>(
  eventName: E,
  payload: AnalyticsPayloadMap[E]
): void {
  if (process.env.NODE_ENV === "development") {
    console.log("[Analytics]", eventName, payload);
  }
}
