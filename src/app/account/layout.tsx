import { QueryProvider } from "@/components/providers/QueryProvider";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <QueryProvider>{children}</QueryProvider>;
}
