import Link from "next/link";
import { SITE_NAME } from "@/lib/constants";

const shopLinks = [
  { href: "/products", label: "All Products" },
  { href: "/products?category=serum", label: "Serums" },
  { href: "/products?category=moisturizer", label: "Moisturizers" },
  { href: "/products?category=sunscreen", label: "Sun Care" },
  { href: "/products?category=cleanser", label: "Cleansers" },
];

const supportLinks = [
  { href: "/account", label: "My Account" },
  { href: "/orders", label: "Order Tracking" },
  { href: "/cart", label: "Shipping Info" },
  { href: "/wishlist", label: "Returns" },
];

const companyLinks = [
  { href: "/", label: "About Lumina" },
  { href: "/products", label: "Our Formulas" },
  { href: "/account", label: "Contact" },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-foreground text-primary-foreground">
      <div className="container-page grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-[family-name:var(--font-fraunces)] text-2xl">
            {SITE_NAME}
          </p>
          <p className="mt-3 max-w-xs text-sm text-primary-foreground/75">
            Thoughtful skincare for everyday routines — clean formulas, clear
            labels, and concern-led discovery.
          </p>
        </div>

        <FooterColumn title="Shop" links={shopLinks} />
        <FooterColumn title="Support" links={supportLinks} />
        <FooterColumn title="Company" links={companyLinks} />
      </div>

      <div className="border-t border-primary-foreground/15">
        <div className="container-page flex flex-col gap-3 py-5 text-sm text-primary-foreground/70 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {SITE_NAME}. All rights reserved.</p>
          <ul className="flex gap-4">
            <li>
              <a href="https://instagram.com" className="hover:text-primary-foreground">
                Instagram
              </a>
            </li>
            <li>
              <a href="https://youtube.com" className="hover:text-primary-foreground">
                YouTube
              </a>
            </li>
            <li>
              <a href="https://pinterest.com" className="hover:text-primary-foreground">
                Pinterest
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: Array<{ href: string; label: string }>;
}) {
  return (
    <div>
      <h2 className="font-sans text-sm font-semibold tracking-wide uppercase">
        {title}
      </h2>
      <ul className="mt-4 space-y-2">
        {links.map((link) => (
          <li key={link.href + link.label}>
            <Link
              href={link.href}
              className="text-sm text-primary-foreground/75 transition-colors hover:text-primary-foreground"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
