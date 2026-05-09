import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth-client";
import { connectToDatabase } from "@/lib/db";
import { Cart } from "@/lib/models/Cart";
import { Product } from "@/lib/models/Product";

export const runtime = "nodejs";

type AddCartBody = {
  productId?: string;
  quantity?: number;
};

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    let body: AddCartBody;

    try {
      body = (await request.json()) as AddCartBody;
    } catch {
      return NextResponse.json({ message: "Invalid request body." }, { status: 400 });
    }

    const productId = body.productId?.trim() ?? "";
    const quantity = Number.isFinite(body.quantity) ? Math.max(1, Math.floor(body.quantity ?? 1)) : 1;

    if (!productId) {
      return NextResponse.json({ message: "Product ID is required." }, { status: 400 });
    }

    await connectToDatabase();

    const product = await Product.findById(productId).lean();

    if (!product) {
      return NextResponse.json({ message: "Product not found." }, { status: 404 });
    }

    let cart = await Cart.findOne({ user: user.userId });

    if (!cart) {
      cart = await Cart.create({ user: user.userId, items: [{ product: productId, quantity }] });
    } else {
      const existingItem = cart.items.find((item: any) => item.product.toString() === productId);

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({ product: productId as never, quantity } as never);
      }

      await cart.save();
    }

    const populatedCart = await Cart.findById(cart._id)
      .populate({
        path: "items.product",
        populate: { path: "category", select: "name slug" },
      })
      .lean();

    return NextResponse.json(
      { message: "Added to cart.", cart: populatedCart },
      { status: 200 },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to add item to cart.";
    return NextResponse.json({ message }, { status: 500 });
  }
}
