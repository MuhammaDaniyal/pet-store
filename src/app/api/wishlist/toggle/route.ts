import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth-client";
import { connectToDatabase } from "@/lib/db";
import { Product } from "@/lib/models/Product";
import { User } from "@/lib/models/User";

export const runtime = "nodejs";

type ToggleWishlistBody = {
  productId?: string;
};

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    let body: ToggleWishlistBody;

    try {
      body = (await request.json()) as ToggleWishlistBody;
    } catch {
      return NextResponse.json({ message: "Invalid request body." }, { status: 400 });
    }

    const productId = body.productId?.trim() ?? "";

    if (!productId) {
      return NextResponse.json({ message: "Product ID is required." }, { status: 400 });
    }

    await connectToDatabase();

    const product = await Product.findById(productId).lean();

    if (!product) {
      return NextResponse.json({ message: "Product not found." }, { status: 404 });
    }

    const currentUser = await User.findById(user.userId).select("wishlist");

    if (!currentUser) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    const wishlisted = currentUser.wishlist.some((item) => item.toString() === productId);

    if (wishlisted) {
      await User.updateOne({ _id: user.userId }, { $pull: { wishlist: productId } });
      return NextResponse.json({ message: "Removed from wishlist.", wishlisted: false }, { status: 200 });
    }

    await User.updateOne({ _id: user.userId }, { $addToSet: { wishlist: productId } });
    return NextResponse.json({ message: "Added to wishlist.", wishlisted: true }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to update wishlist.";
    return NextResponse.json({ message }, { status: 500 });
  }
}
