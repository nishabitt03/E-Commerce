import type { Order } from "@/types/order";
import type { User } from "@/types/user";

export const mockUser: User = {
  id: "user-001",
  fullName: "Aarav Mehta",
  email: "aarav.mehta@example.com",
  phone: "9876543210",
  city: "Bengaluru",
  state: "Karnataka",
};

export const mockOrders: Order[] = [
  {
    id: "ORD-78421",
    createdAt: "2026-03-10T09:30:00.000Z",
    status: "Delivered",
    paymentMethod: "upi",
    paymentStatus: "paid",
    transactionId: "MOCK-TXN-SEED001",
    items: [
      {
        productId: "p-001",
        name: "Clear Balance Niacinamide Serum",
        brand: "Lumina Lab",
        image:
          "https://images.unsplash.com/photo-1620916568918-f9e8e0b6b4c0?w=400&q=80",
        price: 899,
        quantity: 1,
        variantLabel: "30 ml",
      },
      {
        productId: "p-004",
        name: "Shield Daily SPF 50 Fluid",
        brand: "Solara Guard",
        image:
          "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&q=80",
        price: 799,
        quantity: 1,
        variantLabel: "40 ml",
      },
    ],
    subtotal: 1698,
    discount: 100,
    shipping: 0,
    total: 1598,
    shippingAddress: {
      fullName: "Aarav Mehta",
      phone: "9876543210",
      email: "aarav.mehta@example.com",
      address: "42 Indiranagar 12th Main",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560038",
    },
  },
  {
    id: "ORD-79105",
    createdAt: "2026-03-18T14:15:00.000Z",
    status: "Out for Delivery",
    paymentMethod: "cod",
    paymentStatus: "pending",
    transactionId: "MOCK-TXN-SEED002",
    items: [
      {
        productId: "p-002",
        name: "Dew Layer Hyaluronic Moisturizer",
        brand: "Aurelia Botanics",
        image:
          "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=400&q=80",
        price: 1099,
        quantity: 1,
        variantLabel: "50 g",
      },
    ],
    subtotal: 1099,
    discount: 0,
    shipping: 49,
    total: 1148,
    shippingAddress: {
      fullName: "Aarav Mehta",
      phone: "9876543210",
      email: "aarav.mehta@example.com",
      address: "42 Indiranagar 12th Main",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560038",
    },
  },
  {
    id: "ORD-80233",
    createdAt: "2026-03-20T11:05:00.000Z",
    status: "Processing",
    paymentMethod: "card",
    paymentStatus: "paid",
    transactionId: "MOCK-TXN-SEED003",
    items: [
      {
        productId: "p-003",
        name: "Radiance-C Brightening Serum",
        brand: "Lumina Lab",
        image:
          "https://images.unsplash.com/photo-1608248543804-d1e0de011261?w=400&q=80",
        price: 1299,
        quantity: 1,
        variantLabel: "30 ml",
      },
      {
        productId: "p-012",
        name: "Lip Barrier Balm",
        brand: "Aurelia Botanics",
        image:
          "https://images.unsplash.com/photo-1586495777744-4413f2103256?w=400&q=80",
        price: 399,
        quantity: 2,
        variantLabel: "10 g",
      },
    ],
    subtotal: 2097,
    discount: 150,
    shipping: 0,
    total: 1947,
    shippingAddress: {
      fullName: "Aarav Mehta",
      phone: "9876543210",
      email: "aarav.mehta@example.com",
      address: "42 Indiranagar 12th Main",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560038",
    },
  },
];
