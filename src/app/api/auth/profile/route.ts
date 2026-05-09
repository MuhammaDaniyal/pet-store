import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth-client";
import { findAccountProfileById } from "@/lib/users";

export async function GET() {
  try {
    const authUser = await getCurrentUser();

    if (!authUser?.userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const profile = await findAccountProfileById(authUser.userId);

    if (!profile) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ profile });
  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
