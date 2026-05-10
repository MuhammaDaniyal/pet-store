import { connectToDatabase } from "@/lib/db";
import { Appointment } from "@/lib/models/Appointment";

export const metadata = {
  title: "Appointments Overview | Admin Dashboard",
};

export default async function AdminAppointmentsPage() {
  await connectToDatabase();
  const appointments = await Appointment.find()
    .populate("user", "name email")
    .populate("vet", "name email")
    .sort({ date: -1 })
    .lean();

  return (
    <div className="p-8 sm:p-12">
      <h1 className="text-3xl font-semibold tracking-tight text-primary">Appointments Overview</h1>
      <p className="mt-2 text-secondary">View all appointments across the platform.</p>

      <div className="mt-8 overflow-x-auto rounded-[28px] border border-border bg-surface shadow-[0_16px_40px_rgba(26,83,92,0.05)]">
        <table className="w-full text-left whitespace-nowrap">
          <thead className="border-b border-border bg-background/50">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted">Date & Time</th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted">Customer</th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted">Vet</th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted">Pet</th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted">Type</th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted">Status</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appt: any) => {
              const apptDate = new Date(appt.date).toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              });
              return (
                <tr key={appt._id.toString()} className="border-b border-border/50 hover:bg-surface/50 transition-colors">
                  <td className="px-6 py-4 text-sm text-primary">
                    <span className="font-medium">{apptDate}</span> <span className="text-secondary">· {appt.timeSlot}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-secondary">{appt.user?.name || appt.user?.email || "Unknown"}</td>
                  <td className="px-6 py-4 text-sm text-secondary">{appt.vet?.name || appt.vet?.email || "Unknown"}</td>
                  <td className="px-6 py-4 text-sm">
                    <p className="font-medium text-primary">{appt.petName}</p>
                    {appt.petDescription && <p className="text-xs text-muted-foreground line-clamp-1">{appt.petDescription}</p>}
                  </td>
                  <td className="px-6 py-4 text-sm text-secondary capitalize">{appt.type}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-semibold capitalize ${
                      appt.status === "completed" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                      appt.status === "confirmed" ? "bg-sky-50 text-sky-700 border border-sky-200" :
                      appt.status === "cancelled" ? "bg-red-50 text-red-700 border border-red-200" :
                      "bg-amber-50 text-amber-700 border border-amber-200"
                    }`}>
                      {appt.status}
                    </span>
                  </td>
                </tr>
              );
            })}
            {appointments.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-sm text-secondary">
                  No appointments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
