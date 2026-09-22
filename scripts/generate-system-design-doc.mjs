/**
 * Generates a recruiter presentation Word doc for Lumina Skin system design.
 * Run: node scripts/generate-system-design-doc.mjs
 */
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle, LevelFormat } from "docx";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outPath = path.join(__dirname, "..", "docs", "Lumina-Skin-System-Design-Presentation.docx");

function h1(text) {
  return new Paragraph({
    text,
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 360, after: 200 },
  });
}

function h2(text) {
  return new Paragraph({
    text,
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 280, after: 140 },
  });
}

function h3(text) {
  return new Paragraph({
    text,
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 200, after: 100 },
  });
}

function p(text, opts = {}) {
  return new Paragraph({
    spacing: { after: 120 },
    ...opts,
    children: [
      new TextRun({
        text,
        size: 22,
        font: "Calibri",
      }),
    ],
  });
}

function boldP(label, rest) {
  return new Paragraph({
    spacing: { after: 100 },
    children: [
      new TextRun({ text: label, bold: true, size: 22, font: "Calibri" }),
      new TextRun({ text: rest, size: 22, font: "Calibri" }),
    ],
  });
}

function bullet(text, level = 0) {
  return new Paragraph({
    numbering: { reference: "bullets", level },
    spacing: { after: 80 },
    children: [new TextRun({ text, size: 22, font: "Calibri" })],
  });
}

function mono(text) {
  return new Paragraph({
    spacing: { before: 80, after: 80 },
    border: {
      top: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
      left: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
      right: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
    },
    children: [
      new TextRun({
        text,
        size: 18,
        font: "Consolas",
      }),
    ],
  });
}

const doc = new Document({
  numbering: {
    config: [
      {
        reference: "bullets",
        levels: [
          {
            level: 0,
            format: LevelFormat.BULLET,
            text: "•",
            alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 720, hanging: 360 } } },
          },
          {
            level: 1,
            format: LevelFormat.BULLET,
            text: "○",
            alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 1080, hanging: 360 } } },
          },
        ],
      },
    ],
  },
  styles: {
    default: {
      document: {
        styles: [
          {
            id: "Normal",
            run: { font: "Calibri", size: 22 },
          },
        ],
      },
    },
  },
  sections: [
    {
      properties: {
        page: {
          margin: { top: 720, bottom: 720, left: 864, right: 864 },
        },
      },
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 80 },
          children: [
            new TextRun({
              text: "LUMINA SKIN",
              bold: true,
              size: 36,
              font: "Calibri",
              color: "1F4D3A",
            }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 80 },
          children: [
            new TextRun({
              text: "System Design & Data Flow",
              bold: true,
              size: 32,
              font: "Calibri",
            }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
          children: [
            new TextRun({
              text: "Recruiter Presentation Brief — Performance Commerce Portfolio Project",
              italics: true,
              size: 22,
              font: "Calibri",
              color: "555555",
            }),
          ],
        }),
        p(
          "This document explains how Lumina Skin is designed end-to-end: architecture layers, major user journeys, data flow, payment verification, analytics, SEO, and testing. Use it as a speaking guide in interviews."
        ),

        h1("1. One-Minute Elevator Pitch"),
        p(
          "Lumina Skin is a Next.js App Router ecommerce storefront for skincare. It demonstrates modern frontend architecture: Server Components for catalog/SEO, Client Components for interactivity, Zustand for shopping state, Zod + React Hook Form for checkout validation, Razorpay Test Mode for real payment-gateway patterns (create order → checkout → server signature verify → webhook), plus mock analytics, rule-based recommendations, and automated Jest/Playwright tests."
        ),
        boldP("Important framing: ", "Inspired by performance-commerce problem domains — not a copy of any proprietary brand UI or backend."),

        h1("2. Tech Stack (What to Say)"),
        bullet("Framework: Next.js 16 (App Router) + React 19 + TypeScript"),
        bullet("Styling: Tailwind CSS"),
        bullet("Server data: Mock REST API route handlers + static product catalog"),
        bullet("Client data fetching: TanStack Query (account/catalog demos); listing often uses server fetch + URL params"),
        bullet("Client state: Zustand + localStorage persist (cart, wishlist, orders)"),
        bullet("Forms: React Hook Form + Zod"),
        bullet("Payments: PaymentProvider abstraction → Mock (CI) or Razorpay Test Mode"),
        bullet("Quality: Jest, React Testing Library, Playwright"),
        bullet("SEO: Metadata API, OpenGraph, JSON-LD, sitemap.xml, robots.txt"),

        h1("3. High-Level System Architecture"),
        h2("3.1 Layered View"),
        mono(
          "Browser (UI)\n   ├─ Server Components  → Product pages, SEO, initial HTML\n   ├─ Client Components  → Cart, filters, checkout, Razorpay\n   └─ Zustand stores     → Cart / Wishlist / Orders (persisted)\n\nNext.js Server\n   ├─ Route Handlers     → /api/products, /api/search, /api/payments/*, webhooks\n   ├─ Trusted cart       → Reprice from catalog (never trust client amount)\n   └─ Payment service    → Razorpay SDK (secret key server-only)\n\nExternal\n   └─ Razorpay Test Mode → Orders API + Checkout.js + Webhooks"
        ),
        h2("3.2 Design Principles (Interview Talking Points)"),
        bullet("URL as source of truth for listing filters/sort/pagination (shareable, refresh-safe)"),
        bullet("Server Components by default; Client Components only where interactivity is needed"),
        bullet("Never trust browser-sent payment amounts — server recalculates from product catalog"),
        bullet("Secrets (Razorpay key secret, webhook secret) never reach the browser"),
        bullet("Clear cart only after payment is verified (or COD order is confirmed)"),
        bullet("Analytics and recommendations are mock / rule-based — transparent and interview-friendly"),

        h1("4. Application Routes (User Journey Map)"),
        bullet("/ — Home: hero, best sellers, skin-concern recommendations"),
        bullet("/products — Catalog with filters, sort, pagination"),
        bullet("/products/[slug] — Product detail (gallery, variants, related)"),
        bullet("/search?q= — Search results (noindex)"),
        bullet("/cart → /checkout — Cart then checkout/payment"),
        bullet("/wishlist — Saved products"),
        bullet("/orders — Order history"),
        bullet("/account — Account dashboard"),

        h1("5. Core Data Flows"),

        h2("5.1 Product Discovery Flow"),
        mono(
          "User opens /products\n   → Server Component fetches products (API/data layer)\n   → URL params: category, brand, sort, page\n   → Filters/Sort update URL (Client)\n   → Server re-renders with new query\n   → ProductCard → /products/[slug]"
        ),
        bullet("Why this design: Filters survive refresh and can be shared as links."),
        bullet("Search: Header SearchBar → /search?q=… → search API → results or empty state."),

        h2("5.2 Cart & Wishlist Flow"),
        mono(
          "Add to Cart / Wishlist (Client)\n   → Zustand store updates in memory\n   → Persist middleware writes to localStorage\n   → Header badge reads getItemCount() / items.length\n   → Toast feedback + analytics event\n\nCart page\n   → Hydration-safe mount (avoid SSR mismatch)\n   → Quantity / remove / clear\n   → Totals: subtotal, discount rules, shipping, total"
        ),
        boldP("Stores: ", "cart-store, wishlist-store, toast-store (ephemeral), order-store."),

        h2("5.3 Checkout — Cash on Delivery (COD)"),
        mono(
          "Checkout form (RHF + Zod)\n   → Validate contact + address\n   → paymentMethod = COD\n   → mockPaymentProvider (local success)\n   → createOrder in order-store (paymentStatus: pending)\n   → purchase analytics\n   → clearCart\n   → Success UI"
        ),
        p("COD does not call Razorpay. It demonstrates offline payment + order persistence."),

        h2("5.4 Checkout — Razorpay Test Mode (Primary Online Flow)"),
        mono(
          "1. User selects Pay Online (Razorpay)\n2. Client POST /api/payments/create-order\n      { lines: productId/variantId/qty, claimedTotal, shippingAddress }\n3. Server:\n      - resolveTrustedCart() from catalog\n      - reject if claimedTotal ≠ trusted total\n      - create Razorpay Order (amount in paise) OR mock order\n      - save PendingPaymentSession in memory\n4. Browser opens Razorpay Checkout.js (or Mock Checkout dialog)\n5. On success callback → client has order_id, payment_id, signature\n6. Client POST /api/payments/verify\n7. Server verifies HMAC signature with KEY SECRET\n8. On valid signature:\n      - mark session paid\n      - return application Order\n9. Client persists order, fires payment_success + purchase, clearCart\n10. Success page"
        ),
        h3("Failure / Cancel Path"),
        bullet("Invalid signature, user dismisses checkout, or payment fails"),
        bullet("Show error: cart is preserved — user can retry"),
        bullet("No paid application order is created"),
        bullet("Analytics: payment_failed (no sensitive payload)"),

        h2("5.5 Webhook Flow (Async Confirmation)"),
        mono(
          "Razorpay → POST /api/webhooks/razorpay\n   → Read RAW body (required for HMAC)\n   → Verify X-Razorpay-Signature with WEBHOOK SECRET\n   → Idempotency: skip if event id already processed\n   → payment.captured / order.paid → mark session paid\n   → payment.failed → mark session failed\n   → Return 200"
        ),
        p(
          "Webhooks are a safety net for status updates. Cart clearing stays tied to the verified checkout path so UX stays predictable in this portfolio app."
        ),

        h2("5.6 Skin Concern → Recommendation Flow"),
        mono(
          "Home: select concern (Acne, Dryness, …)\n   → Rule-based scorer (not ML/AI)\n   → Match concern tags (+ rating / bestseller / popularity bonuses)\n   → Sort by score → show Recommended products\n   → Click → PDP + recommendation_click analytics"
        ),

        h2("5.7 Analytics Data Flow"),
        mono(
          "UI / stores → trackEvent(event, payload)\n   → MockAnalyticsProvider → console (dev)\n\nEvents include:\npage_view, product_view, search, add_to_cart, wishlist_*,\nbegin_checkout, payment_initiated, payment_success,\npayment_failed, purchase, skin_concern_selected, recommendation_click"
        ),
        boldP("Security note: ", "No card numbers, CVV, UPI PINs, or payment signatures are sent to analytics."),

        h1("6. State & Data Ownership"),
        h2("6.1 What lives where"),
        bullet("Product catalog: server data layer / API (source of truth for price & stock)"),
        bullet("Cart / Wishlist / Orders (demo): Zustand + localStorage"),
        bullet("Pending Razorpay sessions: in-memory server store (demo substitute for a DB)"),
        bullet("Listing filters: URL search params"),
        h2("6.2 Cart total rules (business logic)"),
        bullet("Subtotal = Σ (trusted price × quantity)"),
        bullet("Discount: 10% if subtotal ≥ ₹1000, capped at ₹200"),
        bullet("Shipping: ₹49 unless free-shipping threshold met"),
        bullet("Payable total = after-discount + shipping → converted to paise for Razorpay"),

        h1("7. Security Model (Strong Interview Section)"),
        bullet("RAZORPAY_KEY_SECRET and RAZORPAY_WEBHOOK_SECRET are server-only"),
        bullet("Only NEXT_PUBLIC_RAZORPAY_KEY_ID is exposed for Checkout.js"),
        bullet("Client cannot invent payable amount — trusted cart + claimedTotal mismatch check"),
        bullet("Payment signature verified on server before creating a paid order"),
        bullet("Webhook HMAC verified before status updates; duplicate events ignored"),
        bullet("No card/CVV/UPI credentials stored in Zustand or localStorage"),
        bullet(".env.local is gitignored; .env.example has placeholders only"),
        boldP("Honest limitation: ", "This is Test Mode / portfolio architecture — not a PCI-certified production system."),

        h1("8. SEO & Performance Design"),
        h2("8.1 SEO"),
        bullet("Public pages: dynamic metadata + OpenGraph"),
        bullet("PDP: Product + BreadcrumbList JSON-LD from real product data"),
        bullet("Home: Organization + WebSite JSON-LD"),
        bullet("Cart/Checkout/Account/Orders/Wishlist: noindex, nofollow"),
        bullet("Search: noindex (avoid thin query URLs)"),
        bullet("sitemap.xml + robots.txt"),
        h2("8.2 Performance tactics"),
        bullet("Server Components for catalog HTML"),
        bullet("next/image with priority only on true LCP images"),
        bullet("next/font for Outfit + Fraunces"),
        bullet("TanStack Query caching tuned (staleTime / gcTime)"),
        bullet("Narrow Zustand selectors (e.g. header getItemCount)"),
        bullet("Hydration-safe client mounts for persisted stores"),

        h1("9. Testing Strategy (Quality Story)"),
        bullet("Jest — business logic: cart, wishlist, schema, recommendations, payment verify, webhooks"),
        bullet("React Testing Library — user-facing components (ProductCard, CheckoutForm, …)"),
        bullet("Playwright — critical journeys: discovery, search, cart, wishlist, COD, mock Razorpay success/fail"),
        p(
          "Automated tests use PAYMENT_MODE=mock so CI does not depend on live Razorpay iframes. Manual Test Mode verification is documented in the README."
        ),

        h1("10. End-to-End Story for the Demo"),
        p("Walk the recruiter through this script:"),
        bullet("1. Home → choose skin concern → open a recommended product"),
        bullet("2. Add to cart → open cart → change quantity"),
        bullet("3. Checkout → fill address → COD → order appears in Orders"),
        bullet("4. Repeat with Pay Online → mock/Razorpay Test Checkout → verified order → empty cart"),
        bullet("5. Mention failure path: payment fails → cart still there → retry"),
        bullet("6. Point to tests + README payment/security sections"),

        h1("11. Known Limitations (Say This Proactively)"),
        bullet("Razorpay runs in Test Mode (or local mock without keys) — no real money"),
        bullet("No real auth/user accounts backend"),
        bullet("Orders/cart persistence is client-side (Zustand); payment sessions are in-memory"),
        bullet("Analytics provider is mocked (swap-ready for GA4/GTM)"),
        bullet("Recommendations are deterministic rules, not ML"),
        bullet("Some product images may 404 if remote Unsplash URLs change"),

        h1("12. Suggested Architecture Diagram (Draw Live)"),
        mono(
          "Customer\n   → Checkout UI\n      → POST /api/payments/create-order\n         → Next.js Server (+ secret)\n            → Razorpay Orders API\n               → order_id back to browser\n                  → Razorpay Checkout\n                     → payment callback\n                        → POST /api/payments/verify\n                           → signature OK → Application Order → Clear Cart\n\nRazorpay Webhooks ──→ /api/webhooks/razorpay → HMAC → update payment status"
        ),

        h1("13. Closing Line for Interviews"),
        p(
          "“I designed Lumina Skin like a production-minded storefront: server-trusted pricing, a real payment verification path, clear client/server boundaries, SEO and accessibility basics, and automated tests around the business-critical flows — while keeping the demo honest about what’s mocked.”"
        ),

        new Paragraph({
          spacing: { before: 400 },
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({
              text: "— End of System Design Brief —",
              italics: true,
              size: 20,
              color: "666666",
              font: "Calibri",
            }),
          ],
        }),
      ],
    },
  ],
});

fs.mkdirSync(path.dirname(outPath), { recursive: true });
const buffer = await Packer.toBuffer(doc);
fs.writeFileSync(outPath, buffer);
console.log("Wrote:", outPath);
