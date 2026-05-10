import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-client";
import { connectToDatabase } from "@/lib/db";
import { Vet } from "@/lib/models/Vet";

export const runtime = "nodejs";

interface ProfileBody {
  bio?: string;
  specialization?: string;
  consultationFee?: number;
  availableDays?: string[];
  timeSlots?: string[];
}

export async function PUT(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== "vet") {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const body = (await request.json()) as ProfileBody;
    const { bio, specialization, consultationFee, availableDays, timeSlots } = body;

    await connectToDatabase();

    // Upsert: create the profile if it doesn't exist yet
    const updated = await Vet.findOneAndUpdate(
      { user: user.userId },
      {
        $set: {
          ...(bio !== undefined && { bio }),
          ...(specialization !== undefined && { specialization }),
          ...(consultationFee !== undefined && { consultationFee }),
          ...(availableDays !== undefined && { availableDays }),
          ...(timeSlots !== undefined && { timeSlots }),
        },
      },
      { new: true, upsert: true, runValidators: true }
    );

    return NextResponse.json(
      { message: "Profile updated successfully.", profile: updated },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to update profile.";
    return NextResponse.json({ message }, { status: 500 });
  }
}
