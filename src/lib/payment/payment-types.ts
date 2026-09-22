import type { CartTotals } from "@/types/cart";
import type {
  OrderItem,
  PaymentMethod,
  PaymentStatus,
  ShippingAddress,
} from "@/types/order";

export type PaymentProviderName = "mock" | "razorpay";

export type GatewayPaymentStatus =
  | "created"
  | "pending"
  | "paid"
  | "failed"
  | "refunded";

export interface CartLineInput {
  productId: string;
  variantId?: string;
  quantity: number;
}

export interface CreatePaymentOrderRequest {
  lines: CartLineInput[];
  /** Client-claimed total in INR — validated server-side, never trusted alone */
  claimedTotal: number;
  currency: "INR";
  shippingAddress: ShippingAddress;
}

export interface CreatePaymentOrderResponse {
  provider: PaymentProviderName;
  keyId: string;
  razorpayOrderId: string;
  amountPaise: number;
  currency: "INR";
  receipt: string;
  totals: CartTotals;
}

export interface VerifyPaymentRequest {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface PaymentVerificationResult {
  success: boolean;
  message: string;
  order?: VerifiedApplicationOrder;
}

export interface VerifiedApplicationOrder {
  id: string;
  createdAt: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  transactionId: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  shippingAddress: ShippingAddress;
}

export interface PendingPaymentSession {
  receipt: string;
  razorpayOrderId: string;
  amountPaise: number;
  currency: "INR";
  totals: CartTotals;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentStatus: GatewayPaymentStatus;
  applicationOrderId?: string;
  razorpayPaymentId?: string;
  createdAt: string;
}

/** Legacy mock card failure constant — used only by the mock provider in tests. */
export const MOCK_FAIL_CARD = "4000000000000002";

export interface MockProcessPaymentRequest {
  amount: number;
  paymentMethod: PaymentMethod;
  cardNumber?: string;
  upiId?: string;
}

export interface MockProcessPaymentResult {
  success: boolean;
  transactionId: string;
  paymentMethod: PaymentMethod;
  message: string;
}
