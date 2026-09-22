"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { OrderCard } from "@/components/orders/OrderCard";
import { useHasMounted } from "@/hooks/use-has-mounted";
import { cn } from "@/lib/utils";
import { mockUser } from "@/data/user";
import { useCartStore } from "@/store/cart-store";
import { useOrderStore } from "@/store/order-store";
import { useWishlistStore } from "@/store/wishlist-store";

const NAV = [
  { href: "/account", label: "Profile" },
  { href: "/orders", label: "Orders" },
  { href: "/wishlist", label: "Wishlist" },
  { href: "/cart", label: "Cart" },
];

export function AccountDashboard() {
  const pathname = usePathname();
  const mounted = useHasMounted();
  const orders = useOrderStore((state) => state.orders);
  const wishlistCount = useWishlistStore((state) => state.items.length);
  const cartCount = useCartStore((state) =>
    state.items.reduce((sum, item) => sum + item.quantity, 0)
  );

  const orderCount = mounted ? orders.length : 0;
  const recentOrders = mounted
    ? [...orders]
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .slice(0, 3)
    : [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl text-foreground">My Account</h1>
        <p className="mt-2 text-muted">
          Demo profile — no authentication is required for this portfolio project.
        </p>
      </div>

      <nav
        className="flex flex-wrap gap-2 border-b border-border pb-4"
        aria-label="Account"
      >
        {NAV.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-primary-foreground"
                  : "bg-surface text-foreground hover:bg-accent-soft"
              )}
              aria-current={active ? "page" : undefined}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <section className="card-surface p-5" aria-labelledby="profile-heading">
        <h2 id="profile-heading" className="font-sans text-lg font-semibold">
          Profile
        </h2>
        <p className="mt-3 text-xl text-foreground">{mockUser.fullName}</p>
        <p className="mt-1 text-muted">{mockUser.email}</p>
        <p className="mt-1 text-sm text-muted">
          {mockUser.phone} · {mockUser.city}, {mockUser.state}
        </p>
      </section>

      <section aria-labelledby="stats-heading">
        <h2 id="stats-heading" className="sr-only">
          Account overview
        </h2>
        <ul className="grid gap-3 sm:grid-cols-3">
          <StatCard
            label="Orders"
            value={mounted ? String(orderCount) : "—"}
            href="/orders"
            description="View your recent orders"
          />
          <StatCard
            label="Wishlist"
            value={mounted ? String(wishlistCount) : "—"}
            href="/wishlist"
            description="Saved products"
          />
          <StatCard
            label="Cart"
            value={mounted ? String(cartCount) : "—"}
            href="/cart"
            description="Items waiting in your cart"
          />
        </ul>
      </section>

      <section aria-labelledby="recent-orders-heading">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <h2
            id="recent-orders-heading"
            className="font-sans text-lg font-semibold text-foreground"
          >
            Recent Orders
          </h2>
          <Link
            href="/orders"
            className="text-sm font-medium text-primary hover:underline"
          >
            View All Orders
          </Link>
        </div>

        {!mounted ? (
          <p className="text-sm text-muted">Loading orders...</p>
        ) : recentOrders.length === 0 ? (
          <p className="text-sm text-muted">No orders yet.</p>
        ) : (
          <ul className="space-y-3">
            {recentOrders.map((order) => (
              <li key={order.id}>
                <OrderCard order={order} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  href,
  description,
}: {
  label: string;
  value: string;
  href: string;
  description: string;
}) {
  return (
    <li>
      <Link
        href={href}
        className="card-surface block p-5 transition-colors hover:border-primary"
      >
        <p className="text-sm font-semibold tracking-wide text-muted uppercase">
          {label}
        </p>
        <p className="mt-2 text-3xl font-semibold text-foreground">{value}</p>
        <p className="mt-1 text-sm text-muted">{description}</p>
      </Link>
    </li>
  );
}
