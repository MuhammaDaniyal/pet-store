import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth-client";
import { connectToDatabase } from "@/lib/db";
import { Cart } from "@/lib/models/Cart";

export const runtime = "nodejs";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    await connectToDatabase();

    const cart = await Cart.findOne({ user: user.userId })
      .populate({
        path: "items.product",
        populate: { path: "category", select: "name slug" },
      })
      .lean();

    return NextResponse.json({ cart: cart ?? { items: [] } }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to fetch cart.";
    return NextResponse.json({ message }, { status: 500 });
  }
}
