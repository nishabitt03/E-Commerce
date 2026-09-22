"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { mockOrders } from "@/data/user";
import type { CartItem, CartTotals } from "@/types/cart";
import type {
  Order,
  OrderItem,
  PaymentMethod,
  PaymentStatus,
  ShippingAddress,
} from "@/types/order";

interface CreateOrderInput {
  items: CartItem[];
  totals: CartTotals;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  transactionId: string;
  shippingAddress: ShippingAddress;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  id?: string;
  createdAt?: string;
  orderItems?: OrderItem[];
}

interface OrderState {
  orders: Order[];
  createOrder: (input: CreateOrderInput) => Order;
  getOrderById: (id: string) => Order | undefined;
  getOrders: () => Order[];
  clearOrders: () => void;
}

function createOrderId(): string {
  const date = new Date();
  const ymd = [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("");
  const suffix = Math.floor(100 + Math.random() * 900);
  return `ORD-${ymd}-${suffix}`;
}

function toOrderItems(items: CartItem[]): OrderItem[] {
  return items.map((item) => ({
    productId: item.productId,
    name: item.name,
    brand: item.brand,
    image: item.image,
    price: item.price,
    quantity: item.quantity,
    variantLabel: item.variantLabel,
  }));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

const ORDER_STATUSES: Order["status"][] = [
  "Processing",
  "Shipped",
  "Out for Delivery",
  "Delivered",
];

const PAYMENT_METHODS: PaymentMethod[] = ["cod", "razorpay", "card", "upi"];
const PAYMENT_STATUSES: PaymentStatus[] = ["pending", "paid", "failed"];

function asString(value: unknown): string | undefined {
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

function asNumber(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function migratePaymentMethod(value: unknown): PaymentMethod {
  if (typeof value === "string" && PAYMENT_METHODS.includes(value as PaymentMethod)) {
    return value as PaymentMethod;
  }
  return "cod";
}

function migratePaymentStatus(
  value: unknown,
  paymentMethod: PaymentMethod
): PaymentStatus {
  if (typeof value === "string" && PAYMENT_STATUSES.includes(value as PaymentStatus)) {
    return value as PaymentStatus;
  }
  return paymentMethod === "cod" ? "pending" : "paid";
}

function migrateShippingAddress(value: unknown): ShippingAddress {
  const address = isRecord(value) ? value : {};
  return {
    fullName: asString(address.fullName) ?? "",
    phone: asString(address.phone) ?? "",
    email: asString(address.email) ?? "",
    address: asString(address.address) ?? "",
    city: asString(address.city) ?? "",
    state: asString(address.state) ?? "",
    pincode: asString(address.pincode) ?? "",
  };
}

function migrateOrderItem(value: unknown): OrderItem | null {
  if (!isRecord(value)) return null;
  const productId = asString(value.productId);
  const name = asString(value.name);
  if (!productId || !name) return null;

  return {
    productId,
    name,
    brand: asString(value.brand) ?? "",
    image: asString(value.image) ?? "",
    price: asNumber(value.price),
    quantity: Math.max(1, Math.floor(asNumber(value.quantity) || 1)),
    variantLabel: asString(value.variantLabel),
  };
}

function migrateOrder(value: unknown): Order | null {
  if (!isRecord(value)) return null;
  const id = asString(value.id);
  const createdAt = asString(value.createdAt);
  if (!id || !createdAt) return null;

  const paymentMethod = migratePaymentMethod(value.paymentMethod);
  const status = ORDER_STATUSES.includes(value.status as Order["status"])
    ? (value.status as Order["status"])
    : "Processing";

  return {
    id,
    createdAt,
    status,
    paymentMethod,
    paymentStatus: migratePaymentStatus(value.paymentStatus, paymentMethod),
    transactionId: asString(value.transactionId),
    razorpayOrderId: asString(value.razorpayOrderId),
    razorpayPaymentId: asString(value.razorpayPaymentId),
    items: Array.isArray(value.items)
      ? value.items
          .map(migrateOrderItem)
          .filter((item): item is OrderItem => item !== null)
      : [],
    subtotal: asNumber(value.subtotal),
    discount: asNumber(value.discount),
    shipping: asNumber(value.shipping),
    total: asNumber(value.total),
    shippingAddress: migrateShippingAddress(value.shippingAddress),
  };
}

function migratePersistedOrders(persistedState: unknown): { orders: Order[] } {
  if (!isRecord(persistedState) || !Array.isArray(persistedState.orders)) {
    return { orders: [] };
  }

  return {
    orders: persistedState.orders
      .map(migrateOrder)
      .filter((order): order is Order => order !== null),
  };
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: mockOrders,

      createOrder: (input) => {
        const order: Order = {
          id: input.id ?? createOrderId(),
          createdAt: input.createdAt ?? new Date().toISOString(),
          status: "Processing",
          paymentMethod: input.paymentMethod,
          paymentStatus: input.paymentStatus,
          transactionId: input.transactionId,
          razorpayOrderId: input.razorpayOrderId,
          razorpayPaymentId: input.razorpayPaymentId,
          items: input.orderItems ?? toOrderItems(input.items),
          subtotal: input.totals.subtotal,
          discount: input.totals.discount,
          shipping: input.totals.shipping,
          total: input.totals.total,
          shippingAddress: input.shippingAddress,
        };

        set((state) => ({
          orders: [
            order,
            ...state.orders.filter((existing) => existing.id !== order.id),
          ],
        }));

        return order;
      },

      getOrderById: (id) => get().orders.find((order) => order.id === id),

      getOrders: () =>
        [...get().orders].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ),

      clearOrders: () => set({ orders: [] }),
    }),
    {
      name: "lumina-orders",
      version: 2,
      partialize: (state) => ({ orders: state.orders }),
      migrate: (persistedState) => migratePersistedOrders(persistedState),
    }
  )
);

/** Persist a verified gateway order (items already shaped as OrderItem[]). */
export function persistVerifiedOrder(order: Order): Order {
  useOrderStore.setState((state) => ({
    orders: [
      order,
      ...state.orders.filter((existing) => existing.id !== order.id),
    ],
  }));
  return order;
}
