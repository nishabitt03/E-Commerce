import { persistVerifiedOrder, useOrderStore } from "@/store/order-store";
import type { CartItem, CartTotals } from "@/types/cart";
import type { Order } from "@/types/order";

const shippingAddress = {
  fullName: "Aarav Mehta",
  phone: "9876543210",
  email: "aarav.mehta@example.com",
  address: "42 Indiranagar 12th Main",
  city: "Bengaluru",
  state: "Karnataka",
  pincode: "560038",
};

const sampleItem: CartItem = {
  productId: "p-001",
  slug: "clear-balance-niacinamide-serum",
  name: "Clear Balance Niacinamide Serum",
  brand: "Lumina Lab",
  image: "https://example.com/serum.jpg",
  price: 899,
  originalPrice: 999,
  quantity: 1,
  maxStock: 10,
  variantLabel: "30 ml",
};

const sampleTotals: CartTotals = {
  subtotal: 899,
  discount: 0,
  shipping: 0,
  total: 899,
  itemCount: 1,
};

const legacyOrder = {
  id: "ORD-LEGACY-1",
  createdAt: "2026-01-15T10:00:00.000Z",
  status: "Delivered",
  paymentMethod: "upi",
  items: [
    {
      productId: "p-001",
      name: "Clear Balance Niacinamide Serum",
      brand: "Lumina Lab",
      image: "https://example.com/serum.jpg",
      price: 899,
      quantity: 1,
    },
  ],
  subtotal: 899,
  discount: 0,
  shipping: 0,
  total: 899,
  shippingAddress,
};

describe("order store", () => {
  beforeEach(() => {
    localStorage.clear();
    useOrderStore.setState({ orders: [] });
  });

  it("creates an order and looks it up by id", () => {
    const order = useOrderStore.getState().createOrder({
      items: [sampleItem],
      totals: sampleTotals,
      paymentMethod: "cod",
      paymentStatus: "pending",
      transactionId: "MOCK-TXN-1",
      shippingAddress,
    });

    expect(order.id).toMatch(/^ORD-/);
    expect(useOrderStore.getState().getOrderById(order.id)).toEqual(order);
    expect(useOrderStore.getState().getOrders()[0]?.id).toBe(order.id);
  });

  it("persists a verified gateway order without duplicating it", () => {
    const verified: Order = {
      id: "ORD-GATEWAY-1",
      createdAt: "2026-03-01T12:00:00.000Z",
      status: "Processing",
      paymentMethod: "razorpay",
      paymentStatus: "paid",
      transactionId: "pay_abc",
      razorpayOrderId: "order_abc",
      razorpayPaymentId: "pay_abc",
      items: [
        {
          productId: "p-001",
          name: "Clear Balance Niacinamide Serum",
          brand: "Lumina Lab",
          image: "https://example.com/serum.jpg",
          price: 899,
          quantity: 1,
        },
      ],
      subtotal: 899,
      discount: 0,
      shipping: 0,
      total: 899,
      shippingAddress,
    };

    persistVerifiedOrder(verified);
    persistVerifiedOrder({ ...verified, paymentStatus: "paid" });

    expect(useOrderStore.getState().orders).toHaveLength(1);
    expect(useOrderStore.getState().getOrderById("ORD-GATEWAY-1")?.paymentMethod).toBe(
      "razorpay"
    );
  });

  it("migrates orders saved under an older persist version", async () => {
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    localStorage.setItem(
      "lumina-orders",
      JSON.stringify({ state: { orders: [legacyOrder] }, version: 1 })
    );

    await useOrderStore.persist.rehydrate();

    const migrated = useOrderStore.getState().getOrderById("ORD-LEGACY-1");
    expect(migrated).toMatchObject({
      id: "ORD-LEGACY-1",
      paymentMethod: "upi",
      paymentStatus: "paid",
      status: "Delivered",
    });
    expect(errorSpy).not.toHaveBeenCalledWith(
      "State loaded from storage couldn't be migrated since no migrate function was provided"
    );

    errorSpy.mockRestore();
  });
});
