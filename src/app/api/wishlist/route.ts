import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth-client";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/lib/models/User";

export const runtime = "nodejs";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    await connectToDatabase();

    const currentUser = await User.findById(user.userId)
      .populate({ path: "wishlist", populate: { path: "category", select: "name slug" } })
      .lean();

    if (!currentUser) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    return NextResponse.json({ wishlist: currentUser.wishlist ?? [] }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to fetch wishlist.";
    return NextResponse.json({ message }, { status: 500 });
  }
}
