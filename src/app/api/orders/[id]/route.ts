import mongoose from "mongoose";
import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth-client";
import { connectToDatabase } from "@/lib/db";
import { Order } from "@/lib/models/Order";

export const runtime = "nodejs";

type OrderParams = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, { params }: OrderParams) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const { id } = await params;

    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json({ message: "Invalid order ID." }, { status: 400 });
    }

    await connectToDatabase();

    const order = await Order.findOne({ _id: id, user: user.userId }).lean();

    if (!order) {
      return NextResponse.json({ message: "Order not found." }, { status: 404 });
    }

    return NextResponse.json({ order }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to fetch order.";
    return NextResponse.json({ message }, { status: 500 });
  }
}
