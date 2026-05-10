import { connectToDatabase } from "@/lib/db";
import { Vet } from "@/lib/models/Vet";
import { Appointment } from "@/lib/models/Appointment";
import { User } from "@/lib/models/User";
import { Users, Stethoscope, CalendarClock } from "lucide-react";

export default async function AdminDashboardPage() {
  await connectToDatabase();

  const [totalVets, totalPendingAppointments, totalUsers] = await Promise.all([
    Vet.countDocuments(),
    Appointment.countDocuments({ status: "pending" }),
    User.countDocuments(),
  ]);

  const stats = [
    { label: "Total Vets", value: totalVets, icon: Stethoscope },
    { label: "Pending Appointments", value: totalPendingAppointments, icon: CalendarClock },
    { label: "Total Users", value: totalUsers, icon: Users },
  ];

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <div className="mb-8">
        <h1 className="text-[clamp(1.8rem,3vw,2.6rem)] font-semibold tracking-[-0.04em] text-primary">Admin Dashboard</h1>
        <p className="mt-3 text-base text-secondary">High-level overview of the platform.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="rounded-[28px] border border-border bg-surface p-6 shadow-[0_16px_40px_rgba(26,83,92,0.05)]">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">{stat.label}</p>
                  <p className="mt-1 text-2xl font-semibold text-primary">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
