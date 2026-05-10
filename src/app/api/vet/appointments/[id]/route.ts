import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-client";
import { connectToDatabase } from "@/lib/db";
import { Appointment } from "@/lib/models/Appointment";

export const runtime = "nodejs";

const ALLOWED_TRANSITIONS: Record<string, string[]> = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["completed", "cancelled"],
  completed: [],
  cancelled: [],
};

interface PatchBody {
  status?: string;
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== "vet") {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const { id } = await params;
    const body = (await request.json()) as PatchBody;
    const { status } = body;

    if (!status) {
      return NextResponse.json({ message: "Status is required." }, { status: 400 });
    }

    await connectToDatabase();

    const appointment = await Appointment.findOne({ _id: id, vet: user.userId });

    if (!appointment) {
      return NextResponse.json(
        { message: "Appointment not found." },
        { status: 404 }
      );
    }

    const allowed = ALLOWED_TRANSITIONS[appointment.status as string] ?? [];
    if (!allowed.includes(status)) {
      return NextResponse.json(
        {
          message: `Cannot transition from "${appointment.status}" to "${status}".`,
        },
        { status: 400 }
      );
    }

    appointment.status = status;
    await appointment.save();

    return NextResponse.json(
      { message: "Appointment updated.", status: appointment.status },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to update appointment.";
    return NextResponse.json({ message }, { status: 500 });
  }
}
