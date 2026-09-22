import { mockOrders, mockUser } from "@/data/user";
import { ApiError } from "@/lib/api/errors";
import type { Order } from "@/types/order";
import type { User } from "@/types/user";

export async function getCurrentUser(): Promise<User> {
  return mockUser;
}

export async function getOrders(): Promise<Order[]> {
  return [...mockOrders].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function getOrderById(id: string): Promise<Order> {
  const order = mockOrders.find((item) => item.id === id);
  if (!order) {
    throw new ApiError(404, `Order not found: ${id}`, "ORDER_NOT_FOUND");
  }
  return order;
}
