"use client";

import Link from "next/link";
import { useState } from "react";
import { SearchBar } from "@/components/common/SearchBar";
import { useHasMounted } from "@/hooks/use-has-mounted";
import { SITE_NAME } from "@/lib/constants";
import { categories } from "@/data/products";
import { getCategoryLabel } from "@/lib/utils/product-params";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const mounted = useHasMounted();
  const cartCount = useCartStore((state) => state.getItemCount());
  const wishlistCount = useWishlistStore((state) => state.items.length);

  const showCartCount = mounted && cartCount > 0;
  const showWishlistCount = mounted && wishlistCount > 0;

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/95 backdrop-blur">
      <div className="container-page flex items-center gap-4 py-3 lg:gap-6 lg:py-4">
        <Link
          href="/"
          className="shrink-0 font-[family-name:var(--font-fraunces)] text-xl tracking-tight text-foreground sm:text-2xl"
        >
          {SITE_NAME}
        </Link>

        <nav className="hidden items-center gap-5 lg:flex" aria-label="Primary">
          <Link
            href="/products"
            className="text-sm font-medium text-foreground transition-colors hover:text-primary"
          >
            Shop
          </Link>
          <div className="relative">
            <button
              type="button"
              className="text-sm font-medium text-foreground transition-colors hover:text-primary"
              aria-expanded={categoriesOpen}
              aria-controls="desktop-categories"
              onClick={() => setCategoriesOpen((open) => !open)}
              onBlur={(event) => {
                if (
                  !event.currentTarget.parentElement?.contains(
                    event.relatedTarget as Node
                  )
                ) {
                  setCategoriesOpen(false);
                }
              }}
            >
              Categories
            </button>
            {categoriesOpen ? (
              <ul
                id="desktop-categories"
                className="absolute top-full left-0 mt-2 min-w-48 rounded-md border border-border bg-surface p-2 shadow-[var(--shadow-md)]"
              >
                {categories.slice(0, 6).map((category) => (
                  <li key={category}>
                    <Link
                      href={`/products?category=${category}`}
                      className="block rounded-md px-3 py-2 text-sm text-foreground hover:bg-accent-soft"
                      onClick={() => setCategoriesOpen(false)}
                    >
                      {getCategoryLabel(category)}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </nav>

        <div className="ml-auto hidden min-w-0 flex-1 justify-center md:flex lg:max-w-md xl:max-w-lg">
          <SearchBar id="header-search-desktop" />
        </div>

        <div className="ml-auto flex items-center gap-1 sm:gap-2 lg:ml-0">
          <Link
            href="/search"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md text-foreground transition-colors hover:bg-accent-soft md:hidden"
            aria-label="Search products"
          >
            <SearchIcon />
          </Link>
          <Link
            href="/wishlist"
            className="hidden h-10 items-center gap-1 rounded-md px-2 text-sm font-medium text-foreground transition-colors hover:bg-accent-soft sm:inline-flex"
            aria-label={
              showWishlistCount
                ? `Wishlist, ${wishlistCount} items`
                : "Wishlist"
            }
          >
            Wishlist
            {showWishlistCount ? (
              <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-accent-soft px-1.5 text-xs font-semibold text-accent">
                {wishlistCount}
              </span>
            ) : null}
          </Link>
          <Link
            href="/account"
            className="hidden h-10 items-center gap-1 rounded-md px-2 text-sm font-medium text-foreground transition-colors hover:bg-accent-soft lg:inline-flex"
          >
            Account
          </Link>
          <Link
            href="/cart"
            className="inline-flex h-10 items-center gap-1 rounded-md px-2 text-sm font-medium text-foreground transition-colors hover:bg-accent-soft"
            aria-label={showCartCount ? `Cart, ${cartCount} items` : "Cart"}
          >
            <CartIcon />
            <span className="hidden sm:inline">Cart</span>
            {showCartCount ? (
              <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-semibold text-primary-foreground">
                {cartCount}
              </span>
            ) : null}
          </Link>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md text-foreground transition-colors hover:bg-accent-soft lg:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      <div className="container-page pb-3 md:hidden">
        <SearchBar id="header-search-mobile" />
      </div>

      {menuOpen ? (
        <div
          id="mobile-menu"
          className="border-t border-border bg-surface lg:hidden"
        >
          <nav
            className="container-page flex flex-col gap-1 py-4"
            aria-label="Mobile"
          >
            <Link
              href="/products"
              className="rounded-md px-3 py-3 text-sm font-medium hover:bg-accent-soft"
              onClick={() => setMenuOpen(false)}
            >
              Shop all products
            </Link>
            <p className="px-3 pt-2 text-xs font-semibold tracking-wide text-muted uppercase">
              Categories
            </p>
            {categories.map((category) => (
              <Link
                key={category}
                href={`/products?category=${category}`}
                className="rounded-md px-3 py-2.5 text-sm hover:bg-accent-soft"
                onClick={() => setMenuOpen(false)}
              >
                {getCategoryLabel(category)}
              </Link>
            ))}
            <Link
              href="/wishlist"
              className="rounded-md px-3 py-3 text-sm font-medium hover:bg-accent-soft"
              onClick={() => setMenuOpen(false)}
            >
              Wishlist
              {showWishlistCount ? ` (${wishlistCount})` : ""}
            </Link>
            <Link
              href="/account"
              className="rounded-md px-3 py-3 text-sm font-medium hover:bg-accent-soft"
              onClick={() => setMenuOpen(false)}
            >
              Account
            </Link>
            <Link
              href="/cart"
              className="rounded-md px-3 py-3 text-sm font-medium hover:bg-accent-soft"
              onClick={() => setMenuOpen(false)}
            >
              Cart
              {showCartCount ? ` (${cartCount})` : ""}
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M16 16l4 4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 6h2l1.5 10h11L21 8H7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="19" r="1.2" fill="currentColor" />
      <circle cx="17" cy="19" r="1.2" fill="currentColor" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 7h16M4 12h16M4 17h16"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
