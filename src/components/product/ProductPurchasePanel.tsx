"use client";

import { useState } from "react";
import { DeliveryInfo } from "@/components/product/DeliveryInfo";
import { ProductActions } from "@/components/product/ProductActions";
import { ProductVariants } from "@/components/product/ProductVariants";
import { QuantitySelector } from "@/components/product/QuantitySelector";
import { formatPrice } from "@/lib/utils";
import { getStockLabel } from "@/lib/utils/stock";
import type { Product } from "@/types/product";

interface ProductPurchasePanelProps {
  product: Product;
}

/** Interactive purchase controls — variants, quantity, and cart actions. */
export function ProductPurchasePanel({ product }: ProductPurchasePanelProps) {
  const [variantId, setVariantId] = useState(product.variants[0]?.id ?? "");
  const [quantity, setQuantity] = useState(1);

  const selectedVariant = product.variants.find(
    (variant) => variant.id === variantId
  );

  const price = selectedVariant?.price ?? product.price;
  const stock = selectedVariant?.stock ?? product.stock;
  const stockStatus = getStockLabel(stock);
  const discount =
    product.originalPrice > price
      ? Math.round(
          ((product.originalPrice - price) / product.originalPrice) * 100
        )
      : product.discountPercentage;

  function handleVariantChange(nextId: string) {
    setVariantId(nextId);
    setQuantity(1);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-baseline gap-3">
        <span className="text-3xl font-semibold text-foreground">
          {formatPrice(price)}
        </span>
        {product.originalPrice > price ? (
          <span className="text-lg text-muted line-through">
            {formatPrice(product.originalPrice)}
          </span>
        ) : null}
        {discount > 0 ? (
          <span className="badge bg-primary text-primary-foreground">
            {discount}% OFF
          </span>
        ) : null}
      </div>

      <ProductVariants
        variants={product.variants}
        selectedId={variantId}
        onChange={handleVariantChange}
      />

      <QuantitySelector
        value={quantity}
        max={Math.max(stock, 0)}
        onChange={setQuantity}
      />

      <p
        className={
          stockStatus.tone === "out"
            ? "text-sm font-semibold text-danger"
            : stockStatus.tone === "low"
              ? "text-sm font-semibold text-warning"
              : "text-sm font-semibold text-success"
        }
      >
        <span className="sr-only">Availability: </span>
        {stockStatus.label}
      </p>

      <DeliveryInfo />

      <ProductActions
        product={product}
        quantity={quantity}
        variant={selectedVariant}
        disabled={stock <= 0}
      />
    </div>
  );
}
