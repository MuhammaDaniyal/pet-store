import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-client";
import { connectToDatabase } from "@/lib/db";
import { Appointment } from "@/lib/models/Appointment";
import { Vet } from "@/lib/models/Vet";

export const runtime = "nodejs";

interface AppointmentBody {
  vetId?: string;
  petName?: string;
  petDescription?: string;
  date?: string;
  timeSlot?: string;
  type?: string;
  fee?: number;
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const body = (await request.json()) as AppointmentBody;
    const { vetId, petName, petDescription, date, timeSlot, type, fee } = body;

    // Validate required fields
    if (!vetId || !petName || !petDescription || !date || !timeSlot || !type) {
      return NextResponse.json(
        { message: "Please provide all required fields." },
        { status: 400 }
      );
    }

    const allowedTypes = ["consultation", "grooming", "checkup"];
    if (!allowedTypes.includes(type)) {
      return NextResponse.json({ message: "Invalid appointment type." }, { status: 400 });
    }

    await connectToDatabase();

    // Verify the vet exists and is available
    const vetProfile = await Vet.findOne({ user: vetId, isVerified: true, isAvailable: true });
    if (!vetProfile) {
      return NextResponse.json(
        { message: "Vet not found or is currently unavailable." },
        { status: 404 }
      );
    }

    // Verify the time slot is valid for this vet
    if (
      vetProfile.timeSlots &&
      vetProfile.timeSlots.length > 0 &&
      !vetProfile.timeSlots.includes(timeSlot)
    ) {
      return NextResponse.json(
        { message: "Selected time slot is not available for this vet." },
        { status: 400 }
      );
    }

    const appointment = await Appointment.create({
      user: user.userId,
      vet: vetId,
      petName,
      petDescription,
      date: new Date(date),
      timeSlot,
      type,
      fee: fee ?? vetProfile.consultationFee ?? 0,
      status: "pending",
    });

    return NextResponse.json(
      { message: "Appointment booked successfully.", appointmentId: appointment._id },
      { status: 201 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to book appointment.";
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    await connectToDatabase();

    const appointments = await Appointment.find({ user: user.userId })
      .populate("vet", "name email")
      .sort({ date: -1 })
      .lean();

    return NextResponse.json({ appointments }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to fetch appointments.";
    return NextResponse.json({ message }, { status: 500 });
  }
}
