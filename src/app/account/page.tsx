import type { Metadata } from "next";
import { AccountDashboard } from "@/components/account/AccountDashboard";
import { createNoIndexMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createNoIndexMetadata(
  "My Account",
  "Your Lumina Skin account overview."
);

export default function AccountPage() {
  return (
    <div className="container-page py-8 sm:py-10">
      <AccountDashboard />
    </div>
  );
}
