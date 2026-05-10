import mongoose from "mongoose";
import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth-client";
import { connectToDatabase } from "@/lib/db";
import { Order } from "@/lib/models/Order";

export const runtime = "nodejs";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    await connectToDatabase();

    const order = await Order.findById(id);

    if (!order) {
      return NextResponse.json({ message: "Order not found." }, { status: 404 });
    }

    // Verify ownership
    if (order.user.toString() !== user.userId) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    // Can only cancel if status is confirmed (not shipped or delivered)
    if (order.status !== "confirmed") {
      return NextResponse.json(
        {
          message: `Cannot cancel order with status "${order.status}". Orders can only be cancelled before shipment.`,
        },
        { status: 400 }
      );
    }

    await Order.updateOne({ _id: order._id }, { $set: { status: "cancelled" } });

    return NextResponse.json(
      { message: "Order cancelled successfully." },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to cancel order.";
    return NextResponse.json({ message }, { status: 500 });
  }
}
