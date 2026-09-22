"use client";

import { useEffect, useRef } from "react";
import { trackEvent } from "@/lib/analytics/analytics";

interface ProductViewTrackerProps {
  productId: string;
  productName: string;
  price: number;
}

export function ProductViewTracker({
  productId,
  productName,
  price,
}: ProductViewTrackerProps) {
  const tracked = useRef(false);

  useEffect(() => {
    if (tracked.current) return;
    tracked.current = true;
    trackEvent("product_view", { productId, productName, price });
  }, [productId, productName, price]);

  return null;
}
