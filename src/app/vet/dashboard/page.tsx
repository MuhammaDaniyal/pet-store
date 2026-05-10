import { redirect } from "next/navigation";
import Link from "next/link";
import { CalendarDays, Clock, CheckCircle2, ArrowRight, Stethoscope } from "lucide-react";
import { getCurrentUser } from "@/lib/auth-client";
import { connectToDatabase } from "@/lib/db";
import { Appointment } from "@/lib/models/Appointment";

interface AppointmentDoc {
  _id: { toString(): string };
  user: { name?: string; email?: string } | null;
  petName: string;
  petDescription?: string;
  date: Date | string;
  timeSlot: string;
  type: "consultation" | "grooming" | "checkup";
  status: "pending" | "confirmed" | "completed" | "cancelled";
}

export const metadata = {
  title: "Vet Dashboard | PetStore",
  description: "Manage your appointments and schedule.",
};

export default async function VetDashboardPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "vet") redirect("/");

  await connectToDatabase();

  const allAppointments = (await Appointment.find({ vet: user.userId })
    .populate("user", "name email")
    .sort({ date: 1 })
    .lean()) as unknown as AppointmentDoc[];

  // Stats
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayEnd = new Date(todayStart.getTime() + 86400000);

  const pending = allAppointments.filter((a) => a.status === "pending").length;
  const completed = allAppointments.filter((a) => a.status === "completed").length;
  const todaysAppointments = allAppointments.filter((a) => {
    const d = new Date(a.date);
    return (
      d >= todayStart &&
      d < todayEnd &&
      (a.status === "confirmed" || a.status === "pending")
    );
  });

  const stats = [
    {
      label: "Pending",
      value: pending,
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-50 border-amber-200",
      iconBg: "bg-amber-100",
    },
    {
      label: "Today's Appointments",
      value: todaysAppointments.length,
      icon: CalendarDays,
      color: "text-sky-600",
      bg: "bg-sky-50 border-sky-200",
      iconBg: "bg-sky-100",
    },
    {
      label: "Total Completed",
      value: completed,
      icon: CheckCircle2,
      color: "text-emerald-600",
      bg: "bg-emerald-50 border-emerald-200",
      iconBg: "bg-emerald-100",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="rounded-[32px] border border-border bg-surface p-6 shadow-[0_20px_60px_rgba(26,83,92,0.06)] sm:p-8">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-accent/10 text-accent">
            <Stethoscope className="h-7 w-7" />
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted">
              Welcome back
            </p>
            <h1 className="mt-1 text-3xl font-semibold tracking-[-0.03em] text-primary">
              {user.name}
            </h1>
          </div>
        </div>
      </section>

      {/* Stat cards */}
      <section className="grid gap-4 sm:grid-cols-3">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className={`rounded-[28px] border p-5 shadow-[0_16px_40px_rgba(26,83,92,0.05)] ${s.bg}`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted">
                    {s.label}
                  </p>
                  <p className={`mt-3 text-4xl font-bold tracking-tight ${s.color}`}>
                    {s.value}
                  </p>
                </div>
                <div className={`rounded-2xl p-3 ${s.iconBg}`}>
                  <Icon className={`h-5 w-5 ${s.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* Today's Schedule */}
      <section className="rounded-[28px] border border-border bg-surface p-6 shadow-[0_16px_40px_rgba(26,83,92,0.05)]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted">
              Today
            </p>
            <h2 className="mt-1 text-xl font-semibold text-primary">Upcoming Appointments</h2>
          </div>
          <Link
            href="/vet/appointments"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline"
          >
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {todaysAppointments.length === 0 ? (
          <div className="mt-6 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border py-12 text-center">
            <CalendarDays className="h-8 w-8 text-muted" />
            <p className="text-sm text-secondary">No appointments scheduled for today.</p>
          </div>
        ) : (
          <ul className="mt-5 space-y-3">
            {todaysAppointments.map((appt) => (
              <li
                key={appt._id.toString()}
                className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-background/60 px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/10 text-accent">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-primary">
                      {appt.user?.name ?? "Unknown client"}
                    </p>
                    <p className="text-xs text-secondary capitalize">
                      {appt.type} · {appt.petName}
                    </p>
                    {appt.petDescription && (
                      <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                        {appt.petDescription}
                      </p>
                    )}
                  </div>
                </div>
                <span className="shrink-0 rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700 border border-sky-200">
                  {appt.timeSlot}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
