import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth-client";
import { connectToDatabase } from "@/lib/db";
import { Cart } from "@/lib/models/Cart";

export const runtime = "nodejs";

export async function DELETE() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    await connectToDatabase();

    await Cart.updateOne({ user: user.userId }, { $set: { items: [] } });

    return NextResponse.json({ message: "Cart cleared." }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to clear cart.";
    return NextResponse.json({ message }, { status: 500 });
  }
}
