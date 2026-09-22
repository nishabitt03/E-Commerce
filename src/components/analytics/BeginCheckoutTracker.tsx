"use client";

import { useEffect, useRef } from "react";
import { trackEvent } from "@/lib/analytics/analytics";

interface BeginCheckoutTrackerProps {
  itemCount: number;
  total: number;
}

export function BeginCheckoutTracker({
  itemCount,
  total,
}: BeginCheckoutTrackerProps) {
  const tracked = useRef(false);

  useEffect(() => {
    if (tracked.current || itemCount === 0) return;
    tracked.current = true;
    trackEvent("begin_checkout", { itemCount, total });
  }, [itemCount, total]);

  return null;
}
