export type AnalyticsEvent =
  | "page_view"
  | "product_view"
  | "search"
  | "add_to_cart"
  | "remove_from_cart"
  | "wishlist_add"
  | "wishlist_remove"
  | "begin_checkout"
  | "payment_initiated"
  | "payment_success"
  | "payment_failed"
  | "purchase"
  | "recommendation_click"
  | "skin_concern_selected";

export interface PageViewPayload {
  path: string;
}

export interface ProductViewPayload {
  productId: string;
  productName: string;
  price: number;
}

export interface SearchPayload {
  query: string;
  resultCount: number;
}

export interface AddToCartPayload {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
}

export interface RemoveFromCartPayload {
  productId: string;
  productName: string;
}

export interface WishlistPayload {
  productId: string;
  productName: string;
}

export interface BeginCheckoutPayload {
  itemCount: number;
  total: number;
}

export interface PaymentInitiatedPayload {
  total: number;
  itemCount: number;
}

export interface PaymentSuccessPayload {
  orderId: string;
  total: number;
}

export interface PaymentFailedPayload {
  reason: string;
}

export interface PurchasePayload {
  orderId: string;
  total: number;
  paymentMethod: string;
}

export interface SkinConcernPayload {
  concern: string;
}

export interface RecommendationClickPayload {
  concern: string;
  productId: string;
  productName: string;
}

export type AnalyticsPayloadMap = {
  page_view: PageViewPayload;
  product_view: ProductViewPayload;
  search: SearchPayload;
  add_to_cart: AddToCartPayload;
  remove_from_cart: RemoveFromCartPayload;
  wishlist_add: WishlistPayload;
  wishlist_remove: WishlistPayload;
  begin_checkout: BeginCheckoutPayload;
  payment_initiated: PaymentInitiatedPayload;
  payment_success: PaymentSuccessPayload;
  payment_failed: PaymentFailedPayload;
  purchase: PurchasePayload;
  skin_concern_selected: SkinConcernPayload;
  recommendation_click: RecommendationClickPayload;
};
