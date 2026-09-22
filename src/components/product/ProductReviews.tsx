import { Rating } from "@/components/common/Rating";
import type { Review } from "@/types/product";

interface ProductReviewsProps {
  rating: number;
  reviewCount: number;
  reviews: Review[];
}

export function ProductReviews({
  rating,
  reviewCount,
  reviews,
}: ProductReviewsProps) {
  return (
    <section aria-labelledby="reviews-heading">
      <h2 id="reviews-heading" className="text-2xl text-foreground">
        Customer Reviews
      </h2>

      <div className="mt-4 flex flex-wrap items-center gap-4">
        <p className="text-3xl font-semibold text-foreground">
          {rating.toFixed(1)}
          <span className="text-lg font-normal text-muted"> / 5</span>
        </p>
        <Rating value={rating} reviewCount={reviewCount} />
      </div>

      {reviews.length === 0 ? (
        <p className="mt-6 text-sm text-muted">No reviews yet for this product.</p>
      ) : (
        <ul className="mt-8 space-y-4">
          {reviews.map((review) => (
            <li
              key={review.id}
              className="rounded-lg border border-border bg-surface p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-semibold text-foreground">{review.author}</p>
                <time className="text-xs text-muted" dateTime={review.createdAt}>
                  {review.createdAt}
                </time>
              </div>
              <div className="mt-2">
                <Rating value={review.rating} />
              </div>
              <h3 className="mt-3 font-sans text-base font-semibold text-foreground">
                {review.title}
              </h3>
              <p className="mt-1 text-sm text-muted">{review.body}</p>
              {review.verifiedPurchase ? (
                <p className="mt-3 text-xs font-semibold tracking-wide text-success uppercase">
                  Verified purchase
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
