import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-client";
import { connectToDatabase } from "@/lib/db";
import { Vet } from "@/lib/models/Vet";

export const runtime = "nodejs";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser();
    
    // Check if the current user is an admin
    if (!user || user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { isVerified } = body;

    if (typeof isVerified !== "boolean") {
      return NextResponse.json({ message: "isVerified boolean is required." }, { status: 400 });
    }

    await connectToDatabase();
    
    const vet = await Vet.findByIdAndUpdate(
      id,
      { isVerified },
      { new: true, runValidators: true }
    );

    if (!vet) {
      return NextResponse.json({ message: "Vet not found." }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Vet verification status updated.", vet },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to update vet.";
    return NextResponse.json({ message }, { status: 500 });
  }
}
