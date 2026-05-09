import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth-client";
import { connectToDatabase } from "@/lib/db";
import { Cart } from "@/lib/models/Cart";

export const runtime = "nodejs";

type UpdateCartBody = {
  productId?: string;
  quantity?: number;
};

export async function PATCH(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    let body: UpdateCartBody;

    try {
      body = (await request.json()) as UpdateCartBody;
    } catch {
      return NextResponse.json({ message: "Invalid request body." }, { status: 400 });
    }

    const productId = body.productId?.trim() ?? "";
    const quantity = Number.isFinite(body.quantity) ? Math.floor(body.quantity ?? 1) : NaN;

    if (!productId || !Number.isFinite(quantity) || quantity < 1) {
      return NextResponse.json({ message: "Product ID and a valid quantity are required." }, { status: 400 });
    }

    await connectToDatabase();

    const result = await Cart.updateOne(
      { user: user.userId, "items.product": productId },
      { $set: { "items.$.quantity": quantity } },
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: "Cart item not found." }, { status: 404 });
    }

    const cart = await Cart.findOne({ user: user.userId })
      .populate({
        path: "items.product",
        populate: { path: "category", select: "name slug" },
      })
      .lean();

    return NextResponse.json({ message: "Cart updated.", cart }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to update cart item.";
    return NextResponse.json({ message }, { status: 500 });
  }
}
