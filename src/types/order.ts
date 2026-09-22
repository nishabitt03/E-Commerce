export type OrderStatus =
  | "Processing"
  | "Shipped"
  | "Out for Delivery"
  | "Delivered";

/** Checkout methods. Legacy seed orders may still use card/upi labels. */
export type PaymentMethod = "cod" | "razorpay" | "card" | "upi";

export type PaymentStatus = "pending" | "paid" | "failed";

export interface ShippingAddress {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  brand: string;
  image: string;
  price: number;
  quantity: number;
  variantLabel?: string;
}

export interface Order {
  id: string;
  createdAt: string;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  transactionId?: string;
  /** Non-sensitive Razorpay identifiers only — never card/CVV/UPI secrets */
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  shippingAddress: ShippingAddress;
}
