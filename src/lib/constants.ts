/**
 * Site-wide constants. Prefer env vars in production.
 */
export const SITE_NAME = "Lumina Skin";
export const SITE_DESCRIPTION =
  "Performance-minded skincare with clean formulas, honest pricing, and concern-based recommendations.";

export function getSiteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "http://localhost:3000"
  );
}

export function getApiUrl(): string {
  return (
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
    `${getSiteUrl()}/api`
  );
}
