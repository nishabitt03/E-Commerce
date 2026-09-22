import type { Product, ProductVariant } from "@/types/product";

export const sampleVariant: ProductVariant = {
  id: "v-test-30",
  label: "30 ml",
  sku: "TEST-30",
  price: 799,
  stock: 10,
};

export const sampleVariantLarge: ProductVariant = {
  id: "v-test-50",
  label: "50 ml",
  sku: "TEST-50",
  price: 1199,
  stock: 5,
};

export const sampleProduct: Product = {
  id: "p-test-1",
  slug: "test-clarifying-serum",
  name: "Test Clarifying Serum",
  brand: "Lumina Lab",
  category: "serum",
  description: "A test serum for acne-prone skin.",
  ingredients: ["Aqua", "Niacinamide"],
  benefits: ["Lightweight"],
  howToUse: ["Apply daily"],
  price: 799,
  originalPrice: 999,
  discountPercentage: 20,
  rating: 4.7,
  reviewCount: 120,
  images: [
    "https://images.unsplash.com/photo-1620916568918-f9e8e0b6b4c0?w=400&q=80",
  ],
  variants: [sampleVariant, sampleVariantLarge],
  stock: 15,
  concerns: ["acne", "dullness"],
  isBestSeller: true,
  isNewArrival: false,
  reviews: [],
};

export const sampleProductB: Product = {
  ...sampleProduct,
  id: "p-test-2",
  slug: "test-moisture-cream",
  name: "Test Moisture Cream",
  brand: "Aurelia Botanics",
  category: "moisturizer",
  price: 1099,
  originalPrice: 1299,
  rating: 4.2,
  reviewCount: 40,
  variants: [
    {
      id: "v-moist-50",
      label: "50 g",
      sku: "MOIST-50",
      price: 1099,
      stock: 8,
    },
  ],
  stock: 8,
  concerns: ["dryness", "sensitive-skin"],
  isBestSeller: false,
  isNewArrival: true,
};
