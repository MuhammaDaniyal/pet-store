import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth-client";
import { connectToDatabase } from "@/lib/db";
import { Order } from "@/lib/models/Order";

export const runtime = "nodejs";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    await connectToDatabase();

    const orders = await Order.find({ user: user.userId }).sort({ createdAt: -1 }).lean();

    return NextResponse.json({ orders }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to fetch orders.";
    return NextResponse.json({ message }, { status: 500 });
  }
}
