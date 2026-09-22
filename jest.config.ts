import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  dir: "./",
});

const config: Config = {
  coverageProvider: "v8",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testMatch: [
    "**/__tests__/**/*.(test|spec).[jt]s?(x)",
    "**/?(*.)+(spec|test).[jt]s?(x)",
  ],
  testPathIgnorePatterns: [
    "<rootDir>/node_modules/",
    "<rootDir>/.next/",
    "<rootDir>/e2e/",
    "<rootDir>/src/__tests__/fixtures/",
  ],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  collectCoverageFrom: [
    "src/lib/**/*.{ts,tsx}",
    "src/store/**/*.{ts,tsx}",
    "src/schemas/**/*.{ts,tsx}",
    "src/app/api/payments/**/*.{ts,tsx}",
    "src/app/api/webhooks/**/*.{ts,tsx}",
    "src/components/product/ProductCard.tsx",
    "src/components/product/WishlistButton.tsx",
    "src/components/product/QuantitySelector.tsx",
    "src/components/common/SearchBar.tsx",
    "src/components/cart/**/*.{ts,tsx}",
    "src/components/checkout/CheckoutForm.tsx",
    "src/components/recommendation/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
  ],
};

export default createJestConfig(config);
