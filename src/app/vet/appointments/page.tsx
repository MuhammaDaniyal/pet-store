import { redirect } from "next/navigation";
import { CalendarDays } from "lucide-react";
import { getCurrentUser } from "@/lib/auth-client";
import { connectToDatabase } from "@/lib/db";
import { Appointment } from "@/lib/models/Appointment";
import AppointmentRow from "./AppointmentRow";

interface AppointmentDoc {
  _id: { toString(): string };
  user: { _id: { toString(): string }; name?: string; email?: string } | null;
  pet: string;
  date: Date | string;
  timeSlot: string;
  type: "consultation" | "grooming" | "checkup";
  status: "pending" | "confirmed" | "completed" | "cancelled";
}

export const metadata = {
  title: "Appointments | Vet Dashboard",
};

export default async function VetAppointmentsPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "vet") redirect("/");

  await connectToDatabase();

  const raw = await Appointment.find({ vet: user.userId })
    .populate("user", "name email")
    .sort({ date: -1 })
    .lean();

  const appointments = raw as unknown as AppointmentDoc[];

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="rounded-[32px] border border-border bg-surface p-6 shadow-[0_20px_60px_rgba(26,83,92,0.06)] sm:p-8">
        <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted">
          Management
        </p>
        <h1 className="mt-2 text-[clamp(1.8rem,3vw,2.6rem)] font-semibold tracking-[-0.04em] text-primary">
          All Appointments
        </h1>
        <p className="mt-2 text-sm text-secondary">
          Review, confirm, and manage your client bookings.
        </p>
      </section>

      {/* Appointment list */}
      {appointments.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-[28px] border border-dashed border-border py-20 text-center">
          <CalendarDays className="h-10 w-10 text-muted" />
          <p className="text-sm text-secondary">No appointments yet.</p>
        </div>
      ) : (
        <section className="space-y-4">
          {appointments.map((appt) => {
            const apptDate = new Date(appt.date).toLocaleDateString("en-PK", {
              weekday: "short",
              year: "numeric",
              month: "short",
              day: "numeric",
            });

            return (
              <AppointmentRow
                key={appt._id.toString()}
                id={appt._id.toString()}
                clientName={appt.user?.name ?? appt.user?.email ?? "Unknown client"}
                pet={appt.pet}
                type={appt.type}
                date={apptDate}
                timeSlot={appt.timeSlot}
                initialStatus={appt.status}
              />
            );
          })}
        </section>
      )}
    </div>
  );
}
