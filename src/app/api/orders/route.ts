import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth-client";
import { connectToDatabase } from "@/lib/db";
import { Order } from "@/lib/models/Order";

export const runtime = "nodejs";

function calculateDeliveryDays(orderId: string): number {
  // Use order ID as seed for consistent random number
  let hash = 0;
  for (let i = 0; i < orderId.length; i++) {
    hash = ((hash << 5) - hash) + orderId.charCodeAt(i);
    hash = hash & hash; // Convert to 32-bit integer
  }
  // Generate random number between 2-4 days
  return 2 + (Math.abs(hash) % 3);
}

async function updateOrderStatus(order: any): Promise<boolean> {
  const now = new Date();
  const createdAt = new Date(order.createdAt);
  const elapsedMs = now.getTime() - createdAt.getTime();
  const elapsedDays = elapsedMs / (1000 * 60 * 60 * 24);

  let newStatus = order.status;

  // Transition pending → confirmed (immediately or for legacy orders)
  if (order.status === "pending") {
    newStatus = "confirmed";
  } else if (order.status === "confirmed" && elapsedDays >= 1) {
    newStatus = "shipped";
  } else if (order.status === "shipped") {
    const deliveryDays = calculateDeliveryDays(order._id.toString());
    if (elapsedDays >= 1 + deliveryDays) {
      newStatus = "delivered";
    }
  }

  if (newStatus !== order.status) {
    await Order.updateOne({ _id: order._id }, { $set: { status: newStatus } });
    return true;
  }

  return false;
}

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    await connectToDatabase();

    const orders = await Order.find({ user: user.userId }).sort({ createdAt: -1 });

    // Update statuses based on elapsed time
    for (const order of orders) {
      await updateOrderStatus(order);
    }

    // Re-fetch updated orders
    const updatedOrders = await Order.find({ user: user.userId }).sort({ createdAt: -1 }).lean();

    return NextResponse.json({ orders: updatedOrders }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to fetch orders.";
    return NextResponse.json({ message }, { status: 500 });
  }
}
