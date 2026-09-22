export function getStockLabel(stock: number): {
  label: string;
  tone: "ok" | "low" | "out";
} {
  if (stock <= 0) {
    return { label: "Out of Stock", tone: "out" };
  }

  if (stock <= 10) {
    return { label: `Only ${stock} left`, tone: "low" };
  }

  return { label: "In Stock", tone: "ok" };
}
