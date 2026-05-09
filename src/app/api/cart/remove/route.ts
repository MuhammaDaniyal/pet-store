import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth-client";
import { connectToDatabase } from "@/lib/db";
import { Cart } from "@/lib/models/Cart";

export const runtime = "nodejs";

type RemoveCartBody = {
  productId?: string;
};

export async function DELETE(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    let body: RemoveCartBody;

    try {
      body = (await request.json()) as RemoveCartBody;
    } catch {
      return NextResponse.json({ message: "Invalid request body." }, { status: 400 });
    }

    const productId = body.productId?.trim() ?? "";

    if (!productId) {
      return NextResponse.json({ message: "Product ID is required." }, { status: 400 });
    }

    await connectToDatabase();

    await Cart.updateOne({ user: user.userId }, { $pull: { items: { product: productId } } });

    const cart = await Cart.findOne({ user: user.userId })
      .populate({
        path: "items.product",
        populate: { path: "category", select: "name slug" },
      })
      .lean();

    return NextResponse.json({ message: "Item removed from cart.", cart }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to remove cart item.";
    return NextResponse.json({ message }, { status: 500 });
  }
}
