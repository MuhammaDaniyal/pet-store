import Link from "next/link";
import { redirect } from "next/navigation";
import { CalendarDays, ArrowRight, Clock } from "lucide-react";
import { getCurrentUser } from "@/lib/auth-client";
import { connectToDatabase } from "@/lib/db";
import { Appointment } from "@/lib/models/Appointment";

interface PopulatedVet {
  _id: { toString(): string };
  name: string;
  email: string;
}

interface AppointmentDoc {
  _id: { toString(): string };
  vet: PopulatedVet;
  petName: string;
  petDescription?: string;
  date: Date | string;
  timeSlot: string;
  type: "consultation" | "grooming" | "checkup";
  status: "pending" | "confirmed" | "completed" | "cancelled";
  fee?: number;
}

const STATUS_STYLES: Record<AppointmentDoc["status"], string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  confirmed: "bg-sky-50 text-sky-700 border-sky-200",
  completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
};

const TYPE_LABEL: Record<AppointmentDoc["type"], string> = {
  consultation: "Consultation",
  grooming: "Grooming",
  checkup: "Check-up",
};

export const metadata = {
  title: "My Appointments | PetStore",
  description: "View and manage your vet appointments.",
};

export default async function AppointmentsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  await connectToDatabase();

  const raw = await Appointment.find({ user: user.userId })
    .populate("vet", "name email")
    .sort({ date: -1 })
    .lean();

  // Type-cast after lean
  const appointments = raw as unknown as AppointmentDoc[];

  return (
    <div className="space-y-6">
      {/* Header card */}
      <section className="rounded-[32px] border border-border bg-surface p-6 shadow-[0_20px_60px_rgba(26,83,92,0.06)] sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted">
              My Appointments
            </p>
            <h1 className="mt-2 text-[clamp(1.8rem,3vw,2.6rem)] font-semibold tracking-[-0.04em] text-primary">
              Your upcoming & past visits
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-secondary sm:text-base">
              Track all your vet bookings, statuses, and appointment details.
            </p>
          </div>

          <Link
            href="/vets"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
          >
            Find a Vet
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* No appointments */}
      {appointments.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-6 rounded-[32px] border border-border bg-surface px-8 py-20 text-center shadow-[0_16px_40px_rgba(26,83,92,0.05)]">
          <div className="rounded-full border border-accent/20 bg-accent/10 p-6">
            <CalendarDays className="h-10 w-10 text-accent" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-primary">No appointments yet</h2>
            <p className="mt-2 text-sm text-secondary">
              You haven&apos;t booked any vet visits. Browse our vets to get started.
            </p>
          </div>
          <Link
            href="/vets"
            className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
          >
            Find a Vet <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        /* Appointments list */
        <section className="space-y-4">
          {appointments.map((appt) => {
            const apptDate = new Date(appt.date);
            const formattedDate = apptDate.toLocaleDateString("en-PK", {
              weekday: "short",
              year: "numeric",
              month: "short",
              day: "numeric",
            });

            return (
              <div
                key={appt._id.toString()}
                className="flex flex-col gap-4 rounded-[24px] border border-border bg-surface p-5 shadow-[0_8px_24px_rgba(26,83,92,0.04)] transition-shadow hover:shadow-[0_16px_40px_rgba(26,83,92,0.09)] sm:flex-row sm:items-center sm:justify-between"
              >
                {/* Left: Date + icon */}
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-2xl bg-accent/10 text-accent">
                    <CalendarDays className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-primary">{formattedDate}</p>
                    <div className="mt-0.5 flex items-center gap-1.5 text-xs text-muted">
                      <Clock className="h-3 w-3" />
                      <span>{appt.timeSlot}</span>
                    </div>
                  </div>
                </div>

                {/* Middle: Details */}
                <div className="flex flex-1 flex-wrap items-center gap-x-8 gap-y-2 sm:justify-center">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">Vet</p>
                    <p className="mt-0.5 text-sm font-medium text-primary">
                      {appt.vet?.name ?? "Unknown"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">Pet</p>
                    <p className="mt-0.5 text-sm font-medium text-primary">{appt.petName}</p>
                    {appt.petDescription && (
                      <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{appt.petDescription}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">Type</p>
                    <p className="mt-0.5 text-sm font-medium text-primary">
                      {TYPE_LABEL[appt.type]}
                    </p>
                  </div>
                  {appt.fee !== undefined && (
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">Fee</p>
                      <p className="mt-0.5 text-sm font-medium text-primary">Rs. {appt.fee}</p>
                    </div>
                  )}
                </div>

                {/* Right: Status badge */}
                <div className="shrink-0">
                  <span
                    className={`rounded-full border px-3 py-1.5 text-xs font-semibold capitalize ${STATUS_STYLES[appt.status]}`}
                  >
                    {appt.status}
                  </span>
                </div>
              </div>
            );
          })}
        </section>
      )}
    </div>
  );
}
