import Link from "next/link";
import { EmptyState } from "@/components/common/EmptyState";

export default function NotFound() {
  return (
    <div className="container-page py-16">
      <EmptyState
        title="Page not found"
        description="The page you’re looking for doesn’t exist or may have moved."
        action={
          <Link href="/" className="btn btn-primary">
            Go to Homepage
          </Link>
        }
      />
    </div>
  );
}
